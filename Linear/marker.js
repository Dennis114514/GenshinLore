/**
 * marker.js — 表格行标记功能
 * 为表格每一行添加复选框和ID列，选中后整行添加删除线并变灰。
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'GenshinLore_marker_checked_ids';

  function loadCheckedIds() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return new Set();
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return new Set();
      return new Set(parsed.map(function (id) { return String(id); }));
    } catch (e) {
      return new Set();
    }
  }

  function saveCheckedIds(ids) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
    } catch (e) {
      // ignore storage errors
    }
  }

  function addCheckedId(ids, id) {
    ids.add(String(id));
    saveCheckedIds(ids);
  }

  function removeCheckedId(ids, id) {
    ids.delete(String(id));
    saveCheckedIds(ids);
  }

  function initMarker() {
    var table = document.querySelector('table');
    if (!table) return;

    var rows = table.querySelectorAll('tr');
    if (!rows.length) return;

    var checkedIds = loadCheckedIds();

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var firstCell = row.querySelector('td');
      if (!firstCell) continue;

      // 跳过 title 行（带 colspan 的）
      if (firstCell.hasAttribute('colspan')) continue;

      // 跳过隐藏行
      if (row.style.display === 'none') continue;

      // 获取序号文本
      var seqText = (firstCell.textContent || '').trim();
      var seqNum = parseInt(seqText, 10);

      // 跳过表头和不可解析的行
      if (isNaN(seqNum)) continue;

      // ---- 创建复选框单元格 ----
      var checkboxCell = document.createElement('td');
      checkboxCell.className = 'marker-checkbox-cell';

      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'marker-checkbox';
      cb.title = '标记 / 取消标记此行';

      cb.addEventListener('change', function (tr, id) {
        return function () {
          if (this.checked) {
            tr.classList.add('marker-checked');
            addCheckedId(checkedIds, id);
          } else {
            tr.classList.remove('marker-checked');
            removeCheckedId(checkedIds, id);
          }
        };
      }(row, seqNum));

      checkboxCell.appendChild(cb);

      // 如果之前已经勾选，则恢复状态
      if (checkedIds.has(String(seqNum))) {
        cb.checked = true;
        row.classList.add('marker-checked');
      }

      // ---- 创建 ID 单元格 ----
      var idCell = document.createElement('td');
      idCell.className = 'marker-id-cell';
      idCell.textContent = seqNum;

      // ---- 插入到行首（先插复选框，再插ID，确保顺序正确） ----
      row.insertBefore(checkboxCell, firstCell);
      row.insertBefore(idCell, firstCell);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMarker);
  } else {
    initMarker();
  }
})();