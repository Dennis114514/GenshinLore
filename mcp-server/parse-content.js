#!/usr/bin/env node
// Parses lore content from the repository into a structured JSON index.
// Sources: md/*.md, basiclore HTML files, his/Mondstadt/base.html

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { join, basename, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..");

/**
 * Split markdown text into sections based on ## headings.
 * Returns { title, intro, sections: [{ heading, content }] }
 */
function parseMdSections(md) {
  const lines = md.split("\n");
  let title = "";
  const introLines = [];
  const sections = [];
  let currentHeading = null;
  let currentLines = [];
  let inIntro = true;

  for (const line of lines) {
    // Title (# heading)
    const h1Match = line.match(/^#\s+(.+)/);
    if (h1Match && !title) {
      title = h1Match[1].replace(/\*\*/g, "").trim();
      continue;
    }

    // Section heading (## or ###)
    const h2Match = line.match(/^(#{2,3})\s+(.+)/);
    if (h2Match) {
      inIntro = false;
      if (currentHeading !== null) {
        sections.push({
          heading: currentHeading,
          content: currentLines.join("\n").trim(),
        });
      }
      currentHeading = h2Match[2].replace(/<sup>\d+<\/sup>/g, "").trim();
      currentLines = [];
      continue;
    }

    if (inIntro) {
      introLines.push(line);
    } else {
      currentLines.push(line);
    }
  }

  // Push last section
  if (currentHeading !== null) {
    sections.push({
      heading: currentHeading,
      content: currentLines.join("\n").trim(),
    });
  }

  return {
    title,
    intro: introLines.join("\n").trim(),
    sections,
  };
}

/**
 * Extract readable text from HTML, stripping tags but preserving structure.
 */
function htmlToText(html) {
  // First, extract specific structured content before stripping all tags
  let text = html;

  // Preserve tooltip content
  text = text.replace(/<span class="tooltip">([^<]*)<\/span>/gi, "[$1]");
  // Reveal hidden text
  text = text.replace(/<span[^>]*class="black-block"[^>]*title="([^"]*)"[^>]*>[^<]*<\/span>/gi, "$1");
  // Remove footnote markers
  text = text.replace(/<sup>\d+<\/sup>/g, "");

  // Convert structural tags to text equivalents
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n");
  text = text.replace(/<\/tr>/gi, "\n");
  text = text.replace(/<\/td>/gi, " | ");
  text = text.replace(/<\/th>/gi, " | ");

  // Strip all remaining HTML tags using a loop to handle nested/malformed tags
  let prev;
  do {
    prev = text;
    text = text.replace(/<[^>]+>/g, "");
  } while (text !== prev);

  // Decode HTML entities last, after all tags are removed.
  // Decode &amp; first so that sequences like &amp;lt; become &lt; (literal text),
  // not accidentally decoded further into <.
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&nbsp;/g, " ");

  // Normalize whitespace
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

/**
 * Parse basiclore HTML files into sections based on <h2> tags.
 */
function parseBasicloreHtml(htmlContent, categoryName) {
  // Extract main content area
  const mainMatch = htmlContent.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!mainMatch) return null;

  const mainHtml = mainMatch[1];
  // Split by <section> or <h2>
  const sectionBlocks = mainHtml.split(/<section[^>]*>/i).filter(Boolean);

  const sections = [];
  let title = categoryName;

  for (const block of sectionBlocks) {
    const h2Match = block.match(/<h2[^>]*>([^<]*(?:<[^>]*>[^<]*)*)<\/h2>/i);
    if (h2Match) {
      const heading = htmlToText(h2Match[1]);
      const content = htmlToText(block);
      if (content.trim()) {
        sections.push({ heading, content });
      }
    }
  }

  // If no sections found, treat entire main content as one section
  if (sections.length === 0) {
    const content = htmlToText(mainHtml);
    if (content.trim()) {
      sections.push({ heading: categoryName, content });
    }
  }

  return { title, intro: "", sections };
}

/**
 * Parse Mondstadt base.html (hardcoded HTML lore, no content.js).
 */
function parseMondstadtHtml(htmlContent) {
  const mainMatch = htmlContent.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!mainMatch) return null;

  const mainHtml = mainMatch[1];
  let title = "序章：蒙德·捕风的异乡人";

  // Extract title
  const titleMatch = mainHtml.match(/<h1[^>]*>([^<]*(?:<[^>]*>[^<]*)*)<\/h1>/i);
  if (titleMatch) {
    title = htmlToText(titleMatch[1]);
  }

  // Split by h2 headings (timeline periods)
  const sections = [];
  const h2Regex = /<h2[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/h2>/gi;
  const h2Matches = [...mainHtml.matchAll(h2Regex)];

  for (let i = 0; i < h2Matches.length; i++) {
    const heading = htmlToText(h2Matches[i][2]);
    const start = h2Matches[i].index + h2Matches[i][0].length;
    const end = i + 1 < h2Matches.length ? h2Matches[i + 1].index : mainHtml.length;
    const sectionHtml = mainHtml.slice(start, end);
    const content = htmlToText(sectionHtml);
    if (content.trim()) {
      sections.push({ heading, content });
    }
  }

  return { title, intro: "", sections };
}

// ─── Main ────────────────────────────────────────────────────────────────────

const loreIndex = {};

// 1. Parse md/*.md files (country histories + Teyvat)
const mdDir = join(REPO_ROOT, "md");
const mdFiles = readdirSync(mdDir).filter(
  (f) => f.endsWith(".md") && f !== "aboutsite.md" && f !== "somewords.md"
);

for (const file of mdFiles) {
  const content = readFileSync(join(mdDir, file), "utf-8");
  const categoryName = basename(file, ".md");
  const parsed = parseMdSections(content);
  loreIndex[categoryName] = {
    title: parsed.title || categoryName,
    source: `md/${file}`,
    intro: parsed.intro,
    sections: parsed.sections,
  };
}

// 2. Parse basiclore/*/base.html files
const basicloreDir = join(REPO_ROOT, "basiclore");
const basicloreDirs = readdirSync(basicloreDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const basicloreNames = {
  descenders: "降临者",
  facilities: "设施",
  god: "魔神/邪神",
  lightrelam: "光界",
  principles: "天理/人界",
  stars: "星空",
  void: "虚空",
};

for (const dir of basicloreDirs) {
  const htmlPath = join(basicloreDir, dir, "base.html");
  if (!existsSync(htmlPath)) continue;
  const htmlContent = readFileSync(htmlPath, "utf-8");
  const displayName = basicloreNames[dir] || dir;
  const parsed = parseBasicloreHtml(htmlContent, displayName);
  if (parsed) {
    loreIndex[`basiclore_${dir}`] = {
      title: displayName,
      source: `basiclore/${dir}/base.html`,
      intro: parsed.intro,
      sections: parsed.sections,
    };
  }
}

// 3. Parse Mondstadt (HTML only, no content.js)
const mondstadtPath = join(REPO_ROOT, "his", "Mondstadt", "base.html");
if (existsSync(mondstadtPath)) {
  const htmlContent = readFileSync(mondstadtPath, "utf-8");
  const parsed = parseMondstadtHtml(htmlContent);
  if (parsed) {
    loreIndex["Mondstadt"] = {
      title: parsed.title,
      source: "his/Mondstadt/base.html",
      intro: parsed.intro,
      sections: parsed.sections,
    };
  }
}

// Write output
const dataDir = join(__dirname, "data");
if (!existsSync(dataDir)) mkdirSync(dataDir);
const outputPath = join(dataDir, "lore-index.json");
writeFileSync(outputPath, JSON.stringify(loreIndex, null, 2), "utf-8");

// Summary
const categories = Object.keys(loreIndex);
console.log(`✅ Parsed ${categories.length} categories:`);
for (const cat of categories) {
  const entry = loreIndex[cat];
  console.log(
    `   - ${cat} (${entry.title}): ${entry.sections.length} sections`
  );
}
console.log(`\n📁 Output: ${outputPath}`);
