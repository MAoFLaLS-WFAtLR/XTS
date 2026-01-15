// ========================================
// 關卡配置檔
// 使用方式:將 nodes-escape 編輯器導出的 JSON 貼到 nodesEscapeLevels 陣列中
// ========================================

// 從 nodes-escape 編輯器導出的關卡資料
const nodesEscapeLevels = [
    // ===== 測試關卡 (範例) =====
    {
        "name": "測試",
        "missionName": "測試關卡",
        "clueGroup": [
            {
                "group": "场景",
                "clues": ["*场景一", "*场景二", "*场景三"],
                "maxClueCount": 1
            }
        ],
        "startClues": ["*场景一"],
        "cutscene": [],
        "achievement": [],
        "nodes": [
            {
                "type": "item",
                "name": "场景一",
                "key": "",
                "scenes": ["*场景一"],
                "nodes": [
                    {
                        "type": "item",
                        "name": "去场景二",
                        "key": "",
                        "interact": [
                            {
                                "type": "click",
                                "clue": ["*场景二"]
                            }
                        ],
                        "_id": 2
                    },
                    {
                        "type": "item",
                        "name": "去场景三",
                        "key": "",
                        "interact": [
                            {
                                "type": "click",
                                "clue": ["*场景三"]
                            }
                        ],
                        "_id": 3
                    },
                    {
                        "type": "item",
                        "name": "结局一",
                        "key": "",
                        "interact": [
                            {
                                "type": "click",
                                "clue": ["@通关-结局一"]
                            }
                        ],
                        "_id": 4
                    }
                ],
                "_id": 1
            },
            {
                "type": "item",
                "name": "场景二",
                "key": "",
                "scenes": ["*场景二"],
                "nodes": [
                    {
                        "type": "item",
                        "name": "去场景一",
                        "key": "",
                        "interact": [
                            {
                                "type": "click",
                                "clue": ["*场景一"]
                            }
                        ],
                        "_id": 6
                    },
                    {
                        "type": "item",
                        "name": "去场景三",
                        "key": "",
                        "interact": [
                            {
                                "type": "click",
                                "clue": ["*场景三"]
                            }
                        ],
                        "_id": 7
                    },
                    {
                        "type": "item",
                        "name": "结局二(好結局)",
                        "key": "",
                        "interact": [
                            {
                                "type": "click",
                                "clue": ["@通关-结局二"]
                            }
                        ],
                        "_id": 8
                    }
                ],
                "_id": 5
            },
            {
                "type": "item",
                "name": "场景三",
                "key": "",
                "scenes": ["*场景三"],
                "nodes": [
                    {
                        "type": "item",
                        "name": "去场景一",
                        "key": "",
                        "interact": [
                            {
                                "type": "click",
                                "clue": ["*场景一"]
                            }
                        ],
                        "_id": 10
                    },
                    {
                        "type": "item",
                        "name": "去场景二",
                        "key": "",
                        "interact": [
                            {
                                "type": "click",
                                "clue": ["*场景二"]
                            }
                        ],
                        "_id": 11
                    },
                    {
                        "type": "item",
                        "name": "失败结局",
                        "key": "",
                        "interact": [
                            {
                                "type": "click",
                                "clue": ["@失败-1"]
                            }
                        ],
                        "_id": 12
                    }
                ],
                "_id": 9
            }
        ]
    },
    
    // ===== 在這裡貼上你從編輯器導出的 JSON =====
    // 複製整個 JSON 物件,包含大括號 { }
    // 多個關卡就用逗號分隔
    
];

// 轉換所有關卡
const chapters = nodesEscapeLevels.map(level => convertNodesEscapeToGame(level));

// 如果需要手動調整轉換後的資料,可以在這裡修改
// 例如:
// chapters[0].completeText = "自訂的完成訊息";
// chapters[0].nextChapter = 1;

console.log('已載入', chapters.length, '個關卡');
