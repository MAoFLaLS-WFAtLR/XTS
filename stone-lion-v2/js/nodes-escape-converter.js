// nodes-escape JSON 轉換器
// 將 nodes-escape 編輯器導出的 JSON 轉換為我們的遊戲格式

function convertNodesEscapeToGame(nodesEscapeData) {
    const converted = {
        title: nodesEscapeData.missionName || "未命名關卡",
        storyText: nodesEscapeData.desc || "開始你的冒險...",
        startScene: null,
        nodes: {},
        interactions: [],
        completeText: "關卡完成!",
        nextChapter: null
    };
    
    // 找出起始場景
    if (nodesEscapeData.startClues && nodesEscapeData.startClues.length > 0) {
        converted.startScene = nodesEscapeData.startClues[0].replace('*', '');
    }
    
    // 處理節點
    nodesEscapeData.nodes.forEach(sceneNode => {
        const sceneName = sceneNode.name;
        
        // 建立場景節點
        converted.nodes[sceneName] = {
            type: "location",
            text: sceneName,
            connections: [],
            hint: `你在 ${sceneName}`
        };
        
        // 處理場景中的子節點
        if (sceneNode.nodes) {
            sceneNode.nodes.forEach(childNode => {
                const childName = childNode.name;
                const childId = `${sceneName}_${childNode._id}`;
                
                // 建立子節點
                converted.nodes[childId] = {
                    type: determineNodeType(childNode, nodesEscapeData),
                    text: childName,
                    movable: false,
                    hint: `點擊 ${childName}`,
                    action: null,
                    target: null,
                    isGoal: false,
                    isBadEnd: false
                };
                
                // 添加到場景的連線
                converted.nodes[sceneName].connections.push(childId);
                
                // 處理交互
                if (childNode.interact && childNode.interact.length > 0) {
                    childNode.interact.forEach(interaction => {
                        if (interaction.type === "click" && interaction.clue) {
                            interaction.clue.forEach(clue => {
                                processClue(clue, childId, converted, childName);
                            });
                        }
                    });
                }
            });
        }
    });
    
    // 如果沒有設定起始場景,使用第一個節點
    if (!converted.startScene && nodesEscapeData.nodes.length > 0) {
        converted.startScene = nodesEscapeData.nodes[0].name;
    }
    
    return converted;
}

function determineNodeType(childNode, gameData) {
    // 檢查是否為通關/失敗節點
    if (childNode.interact && childNode.interact.length > 0) {
        for (let interaction of childNode.interact) {
            if (interaction.clue) {
                for (let clue of interaction.clue) {
                    if (clue.startsWith('@通关') || clue.startsWith('@通關')) {
                        return "goal";
                    }
                    if (clue.startsWith('@失败') || clue.startsWith('@失敗')) {
                        return "item"; // 失敗節點用 item 類型但會標記 isBadEnd
                    }
                }
            }
        }
    }
    return "item";
}

function processClue(clue, nodeId, converted, nodeName) {
    // 場景切換 (以 * 開頭)
    if (clue.startsWith('*')) {
        const targetScene = clue.replace('*', '');
        converted.nodes[nodeId].action = "switchScene";
        converted.nodes[nodeId].target = targetScene;
        converted.nodes[nodeId].hint = `前往 ${targetScene}`;
        return;
    }
    
    // 通關 (以 @通关 或 @通關 開頭)
    if (clue.startsWith('@通关') || clue.startsWith('@通關')) {
        converted.nodes[nodeId].isGoal = true;
        
        // 判斷結局類型
        const endType = clue.includes('结局二') || clue.includes('結局二') ? 'ending2' : 'ending1';
        
        converted.interactions.push({
            items: [nodeId],
            action: "click",
            result: null,
            hint: `觸發 ${nodeName}`,
            complete: true,
            endType: endType
        });
        return;
    }
    
    // 失敗 (以 @失败 或 @失敗 開頭)
    if (clue.startsWith('@失败') || clue.startsWith('@失敗')) {
        converted.nodes[nodeId].isBadEnd = true;
        
        converted.interactions.push({
            items: [nodeId],
            action: "click",
            result: null,
            hint: "遊戲失敗...",
            fail: true
        });
        return;
    }
}

// 導出函數供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { convertNodesEscapeToGame };
}
