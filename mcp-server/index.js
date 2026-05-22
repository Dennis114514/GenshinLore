#!/usr/bin/env node
// GenshinLore MCP Server
// Reads lore directly from md/ source files and basiclore/ HTML at startup.
// Provides 3 tools: get_categories, read_lore, search_lore

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, basename, dirname } from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..");

// ─── Markdown parsing ───────────────────────────────────────────────────────

function parseMdSections(md) {
  const lines = md.split("\n");
  let title = "";
  const introLines = [];
  const sections = [];
  let currentHeading = null;
  let currentLines = [];
  let inIntro = true;

  for (const line of lines) {
    const h1Match = line.match(/^#\s+(.+)/);
    if (h1Match && !title) {
      title = h1Match[1].replace(/\*\*/g, "").trim();
      continue;
    }

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

// ─── HTML parsing (for basiclore and Mondstadt which have no .md source) ────

function htmlToText(html) {
  let text = html;
  text = text.replace(/<span class="tooltip">([^<]*)<\/span>/gi, "[$1]");
  text = text.replace(
    /<span[^>]*class="black-block"[^>]*title="([^"]*)"[^>]*>[^<]*<\/span>/gi,
    "$1"
  );
  text = text.replace(/<sup>\d+<\/sup>/g, "");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n");
  text = text.replace(/<\/tr>/gi, "\n");
  text = text.replace(/<\/td>/gi, " | ");
  text = text.replace(/<\/th>/gi, " | ");

  let prev;
  do {
    prev = text;
    text = text.replace(/<[^>]+>/g, "");
  } while (text !== prev);

  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

function parseBasicloreHtml(htmlContent, categoryName) {
  const mainMatch = htmlContent.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!mainMatch) return null;

  const mainHtml = mainMatch[1];
  const sectionBlocks = mainHtml.split(/<section[^>]*>/i).filter(Boolean);
  const sections = [];

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

  if (sections.length === 0) {
    const content = htmlToText(mainHtml);
    if (content.trim()) {
      sections.push({ heading: categoryName, content });
    }
  }

  return { title: categoryName, intro: "", sections };
}

function parseMondstadtHtml(htmlContent) {
  const mainMatch = htmlContent.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!mainMatch) return null;

  const mainHtml = mainMatch[1];
  let title = "序章：蒙德·捕风的异乡人";

  const titleMatch = mainHtml.match(
    /<h1[^>]*>([^<]*(?:<[^>]*>[^<]*)*)<\/h1>/i
  );
  if (titleMatch) {
    title = htmlToText(titleMatch[1]);
  }

  const sections = [];
  const h2Regex = /<h2[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/h2>/gi;
  const h2Matches = [...mainHtml.matchAll(h2Regex)];

  for (let i = 0; i < h2Matches.length; i++) {
    const heading = htmlToText(h2Matches[i][2]);
    const start = h2Matches[i].index + h2Matches[i][0].length;
    const end =
      i + 1 < h2Matches.length ? h2Matches[i + 1].index : mainHtml.length;
    const sectionHtml = mainHtml.slice(start, end);
    const content = htmlToText(sectionHtml);
    if (content.trim()) {
      sections.push({ heading, content });
    }
  }

  return { title, intro: "", sections };
}

// ─── Build lore index from source files at startup ──────────────────────────

function buildLoreIndex() {
  const index = {};

  // 1. Parse md/*.md files directly
  const mdDir = join(REPO_ROOT, "md");
  if (existsSync(mdDir)) {
    const mdFiles = readdirSync(mdDir).filter(
      (f) => f.endsWith(".md") && f !== "aboutsite.md" && f !== "somewords.md"
    );
    for (const file of mdFiles) {
      const content = readFileSync(join(mdDir, file), "utf-8");
      const categoryName = basename(file, ".md");
      const parsed = parseMdSections(content);
      index[categoryName] = {
        title: parsed.title || categoryName,
        source: `md/${file}`,
        intro: parsed.intro,
        sections: parsed.sections,
      };
    }
  }

  // 2. Parse basiclore HTML files (no md source available)
  const basicloreDir = join(REPO_ROOT, "basiclore");
  const basicloreNames = {
    descenders: "降临者",
    facilities: "设施",
    god: "魔神/邪神",
    lightrelam: "光界",
    principles: "天理/人界",
    stars: "星空",
    void: "虚空",
  };

  if (existsSync(basicloreDir)) {
    const dirs = readdirSync(basicloreDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const dir of dirs) {
      const htmlPath = join(basicloreDir, dir, "base.html");
      if (!existsSync(htmlPath)) continue;
      const htmlContent = readFileSync(htmlPath, "utf-8");
      const displayName = basicloreNames[dir] || dir;
      const parsed = parseBasicloreHtml(htmlContent, displayName);
      if (parsed) {
        index[`basiclore_${dir}`] = {
          title: displayName,
          source: `basiclore/${dir}/base.html`,
          intro: parsed.intro,
          sections: parsed.sections,
        };
      }
    }
  }

  // 3. Parse Mondstadt HTML (no md source, content in raw HTML)
  const mondstadtPath = join(REPO_ROOT, "his", "Mondstadt", "base.html");
  if (existsSync(mondstadtPath)) {
    const htmlContent = readFileSync(mondstadtPath, "utf-8");
    const parsed = parseMondstadtHtml(htmlContent);
    if (parsed) {
      index["Mondstadt"] = {
        title: parsed.title,
        source: "his/Mondstadt/base.html",
        intro: parsed.intro,
        sections: parsed.sections,
      };
    }
  }

  return index;
}

// Build index from source files
const loreIndex = buildLoreIndex();
console.error(
  `Loaded ${Object.keys(loreIndex).length} categories from source files`
);

// ─── Create MCP server ─────────────────────────────────────────────────────

const server = new McpServer({
  name: "genshinlore",
  version: "1.0.0",
});

// ─── Tool 1: get_categories ─────────────────────────────────────────────────

server.tool(
  "get_categories",
  "List all available lore categories and their section titles. Use this first to discover what content is available before reading specific lore.",
  {},
  async () => {
    const categories = Object.entries(loreIndex).map(([key, value]) => ({
      key,
      title: value.title,
      source: value.source,
      sectionCount: value.sections.length,
      sections: value.sections.map((s) => s.heading),
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(categories, null, 2),
        },
      ],
    };
  }
);

// ─── Tool 2: read_lore ──────────────────────────────────────────────────────

server.tool(
  "read_lore",
  "Read lore content for a specific category. Optionally specify a section title to read only that section. Use get_categories first to discover available categories and sections.",
  {
    category: z
      .string()
      .describe(
        "Category key (e.g. 'Fontaine', 'Teyvathis', 'basiclore_god', 'Mondstadt')"
      ),
    section: z
      .string()
      .optional()
      .describe(
        "Optional section heading to read. If omitted, returns the full document."
      ),
  },
  async ({ category, section }) => {
    const entry = loreIndex[category];
    if (!entry) {
      const availableKeys = Object.keys(loreIndex).join(", ");
      return {
        content: [
          {
            type: "text",
            text: `Category "${category}" not found. Available categories: ${availableKeys}`,
          },
        ],
        isError: true,
      };
    }

    if (section) {
      const normalizedQuery = section.toLowerCase();
      const match = entry.sections.find(
        (s) =>
          s.heading.toLowerCase() === normalizedQuery ||
          s.heading.toLowerCase().includes(normalizedQuery)
      );

      if (!match) {
        const availableSections = entry.sections
          .map((s) => s.heading)
          .join(", ");
        return {
          content: [
            {
              type: "text",
              text: `Section "${section}" not found in ${entry.title}. Available sections: ${availableSections}`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `# ${entry.title}\n## ${match.heading}\n\n${match.content}`,
          },
        ],
      };
    }

    let fullText = `# ${entry.title}\n\n`;
    if (entry.intro) {
      fullText += entry.intro + "\n\n";
    }
    for (const sec of entry.sections) {
      fullText += `## ${sec.heading}\n\n${sec.content}\n\n`;
    }

    return {
      content: [
        {
          type: "text",
          text: fullText,
        },
      ],
    };
  }
);

// ─── Tool 3: search_lore ────────────────────────────────────────────────────

server.tool(
  "search_lore",
  "Search across all lore documents for a keyword or phrase. Returns matching sections with snippets.",
  {
    query: z.string().describe("Search keyword or phrase"),
    max_results: z
      .number()
      .optional()
      .default(10)
      .describe("Maximum number of results to return (default: 10)"),
  },
  async ({ query, max_results }) => {
    const normalizedQuery = query.toLowerCase();
    const results = [];

    for (const [categoryKey, entry] of Object.entries(loreIndex)) {
      if (entry.intro && entry.intro.toLowerCase().includes(normalizedQuery)) {
        results.push({
          category: categoryKey,
          title: entry.title,
          section: "(intro)",
          snippet: extractSnippet(entry.intro, normalizedQuery),
        });
      }

      for (const sec of entry.sections) {
        const inHeading = sec.heading.toLowerCase().includes(normalizedQuery);
        const inContent = sec.content.toLowerCase().includes(normalizedQuery);

        if (inHeading || inContent) {
          results.push({
            category: categoryKey,
            title: entry.title,
            section: sec.heading,
            snippet: inContent
              ? extractSnippet(sec.content, normalizedQuery)
              : sec.content.slice(0, 200),
          });
        }

        if (results.length >= max_results) break;
      }
      if (results.length >= max_results) break;
    }

    if (results.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No results found for "${query}".`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }
);

// ─── Helpers ────────────────────────────────────────────────────────────────

function extractSnippet(text, query, contextChars = 150) {
  const lowerText = text.toLowerCase();
  const idx = lowerText.indexOf(query);
  if (idx === -1) return text.slice(0, contextChars * 2);

  const start = Math.max(0, idx - contextChars);
  const end = Math.min(text.length, idx + query.length + contextChars);
  let snippet = text.slice(start, end);

  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";

  return snippet;
}

// ─── Start ──────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GenshinLore MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
