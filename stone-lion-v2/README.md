# 石獅的記憶 - nodes-escape 版本

## 🎯 使用流程

### 1. 在 nodes-escape 編輯器製作關卡
- 設計場景、節點、交互
- 測試關卡邏輯

### 2. 導出 JSON
- 在編輯器中複製完整的 JSON 代碼

### 3. 貼到網站配置
1. 打開 `js/chapters.js`
2. 找到 `nodesEscapeLevels` 陣列
3. 將你的 JSON 貼到陣列中
4. 多個關卡用逗號分隔

**範例:**
```javascript
const nodesEscapeLevels = [
    // 第一關
    {
        "name": "序章",
        "missionName": "新莊廟街",
        // ... 你的 JSON 內容
    },
    
    // 第二關  
    {
        "name": "第一章",
        "missionName": "老店記憶",
        // ... 你的 JSON 內容
    }
];
```

### 4. 部署到 GitHub Pages
1. 上傳所有檔案到 GitHub repository
2. 啟用 GitHub Pages
3. 完成!

---

## 📁 專案結構

```
stone-lion-v2/
├── index.html                      # 主選單
├── game.html                       # 遊戲頁面
├── css/
│   └── style.css                   # 樣式
├── js/
│   ├── nodes-escape-converter.js   # JSON 轉換器
│   ├── chapters.js                 # 關卡配置(貼 JSON 的地方)
│   └── game.js                     # 遊戲引擎
└── README.md                       # 說明文件
```

---

## 🔧 nodes-escape JSON 格式說明

### 支援的功能

✅ **場景切換**
```javascript
"interact": [
    {
        "type": "click",
        "clue": ["*场景名稱"]  // * 開頭表示切換場景
    }
]
```

✅ **通關結局**
```javascript
"interact": [
    {
        "type": "click",
        "clue": ["@通关-结局一"]  // 觸發結局
    }
]
```

✅ **失敗結局**
```javascript
"interact": [
    {
        "type": "click",
        "clue": ["@失败-1"]  // 遊戲失敗
    }
]
```

✅ **多結局系統**
- `@通关-结局一`: 普通結局
- `@通关-结局二`: 好結局(顯示成就提示)

---

## 🎮 遊戲操作

### 電腦
- **點擊**節點展開選項
- **點擊**選項觸發互動

### 手機
- **點擊**節點展開選項
- **點擊**選項觸發互動

---

## ⚡ 快速測試

專案已包含一個測試關卡,直接開啟 `index.html` 即可測試:

**測試關卡玩法:**
1. 開始遊戲 → 進入「場景一」
2. 點擊「場景一」展開選項
3. 點擊「去場景二」→ 切換到場景二
4. 點擊「場景二」展開選項
5. 點擊「結局二(好結局)」→ 完成關卡並獲得成就!

或者:
- 從場景一點擊「去場景三」→「失敗結局」看失敗畫面
- 從場景一點擊「結局一」看普通結局

---

## 🚀 部署步驟

### 方法一:GitHub Pages (推薦)

1. **建立 Repository**
   - 前往 https://github.com/new
   - Repository name: `stone-lion-memory`
   - 選 Public → Create repository

2. **上傳檔案**
   - 點擊 "uploading an existing file"
   - 拖曳所有檔案(不是資料夾)
   - Commit changes

3. **啟用 Pages**
   - Settings → Pages
   - Source: main branch, / (root)
   - Save

4. **取得網址**
   - 等 1-2 分鐘
   - 網址: `https://你的帳號.github.io/stone-lion-memory/`

### 方法二:本地測試

如果只是想在自己電腦測試:
1. 雙擊 `index.html` 直接在瀏覽器開啟
2. 或使用 Live Server (VSCode 擴充套件)

---

## 🔄 更新關卡

1. 在 nodes-escape 編輯器修改
2. 複製新的 JSON
3. 貼到 `js/chapters.js` 替換舊的
4. 重新上傳到 GitHub (或重新整理頁面測試)

---

## ❓ 常見問題

### Q: 修改後沒有生效?
A: 清除瀏覽器快取(Ctrl+Shift+R 或 Cmd+Shift+R)

### Q: 手機上顯示異常?
A: 確認所有檔案都已上傳,特別是 CSS 和 JS 檔案

### Q: 關卡順序怎麼調整?
A: 在 `chapters.js` 中調整 `nodesEscapeLevels` 陣列的順序

### Q: 如何設定關卡接續?
A: 轉換器會自動處理,第一關完成後解鎖第二關

---

## 📝 開發注意事項

### 在編輯器中的最佳實踐

1. **場景命名要清楚**
   - ✅ "新莊廟街"、"慈祐宮內"
   - ❌ "場景1"、"scene_a"

2. **使用明確的結局標記**
   - `@通关-结局一` = 普通結局
   - `@通关-结局二` = 好結局
   - `@失败-1` = 失敗

3. **測試所有路徑**
   - 確保每個場景都能正常切換
   - 確認所有結局都能觸發

---

## 🎨 客製化

### 修改顏色主題
編輯 `css/style.css` 中的顏色變數

### 修改節點樣式
在 `js/game.js` 的 `getNodeColor()` 函數中調整

### 新增音效
在 `executeInteraction()` 函數中加入音效播放邏輯

---

## 📄 授權

此專案為教育用途開發。
nodes-escape 引擎由 hzfe 團隊開發。
