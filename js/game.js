// 改良版遊戲引擎 - 支援場景切換 (nodes-escape 風格)

class GameEngineV2 {
    constructor(canvas, chapterData) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.chapterData = chapterData;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.nodes = new Map();
        this.activeNodes = new Set();
        this.currentScene = null; // 目前場景
        this.draggedNode = null;
        this.hoveredNode = null;
        
        this.initNodes();
        this.switchToScene(chapterData.startScene || "新莊廟街");
        this.bindEvents();
        this.render();
    }
    
    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    initNodes() {
        const nodeData = this.chapterData.nodes;
        
        for (let [key, data] of Object.entries(nodeData)) {
            this.nodes.set(key, {
                key: key,
                text: data.text,
                type: data.type,
                movable: data.movable || false,
                hint: data.hint || "",
                connections: data.connections || [],
                expanded: false,
                isGoal: data.isGoal || false,
                isBadEnd: data.isBadEnd || false,
                action: data.action || null,
                target: data.target || null,
                x: 0,
                y: 0,
                width: 0,
                height: 0
            });
        }
    }
    
    // 切換場景
    switchToScene(sceneName) {
        this.currentScene = sceneName;
        this.activeNodes.clear();
        
        // 激活場景根節點
        this.activateNode(sceneName, this.canvas.width / 2, this.canvas.height / 2);
        
        // 自動展開場景
        setTimeout(() => {
            this.expandNode(sceneName);
        }, 300);
        
        this.showHint(`進入 ${sceneName}`);
    }
    
    activateNode(key, x, y) {
        if (this.activeNodes.has(key)) return;
        
        const node = this.nodes.get(key);
        if (!node) return;
        
        node.x = x;
        node.y = y;
        
        this.ctx.font = '18px "Microsoft JhengHei"';
        const metrics = this.ctx.measureText(node.text);
        node.width = metrics.width + 40;
        node.height = 40;
        
        this.activeNodes.add(key);
        this.showHint(node.hint);
    }
    
    expandNode(nodeKey) {
        const node = this.nodes.get(nodeKey);
        if (!node || node.expanded) return;
        
        node.expanded = true;
        const connections = node.connections;
        
        if (connections.length === 0) return;
        
        const angleStep = (Math.PI * 2) / connections.length;
        const radius = 150;
        
        connections.forEach((childKey, index) => {
            if (!this.activeNodes.has(childKey)) {
                const angle = angleStep * index - Math.PI / 2;
                const childX = node.x + Math.cos(angle) * radius;
                const childY = node.y + Math.sin(angle) * radius;
                this.activateNode(childKey, childX, childY);
            }
        });
    }
    
    handleNodeClick(nodeKey) {
        const node = this.nodes.get(nodeKey);
        
        // 處理場景切換
        if (node.action === "switchScene" && node.target) {
            this.showHint(`正在前往 ${node.target}...`);
            setTimeout(() => {
                this.switchToScene(node.target);
            }, 500);
            return;
        }
        
        // 處理結局觸發
        if (node.isGoal) {
            this.completeLevel("ending");
            return;
        }
        
        if (node.isBadEnd) {
            this.failLevel();
            return;
        }
        
        // 處理一般交互
        this.checkInteraction(nodeKey);
        
        // 展開節點
        if (!node.movable) {
            this.expandNode(nodeKey);
        }
    }
    
    checkInteraction(nodeKey) {
        const interactions = this.chapterData.interactions;
        
        for (let interaction of interactions) {
            if (interaction.items.length === 1 && interaction.items[0] === nodeKey) {
                this.executeInteraction(interaction);
                return true;
            }
        }
        
        return false;
    }
    
    executeInteraction(interaction) {
        this.showHint(interaction.hint);
        
        if (interaction.remove) {
            interaction.remove.forEach(key => {
                this.activeNodes.delete(key);
            });
        }
        
        if (interaction.complete) {
            setTimeout(() => {
                this.completeLevel(interaction.endType || "normal");
            }, 1000);
        }
        
        if (interaction.fail) {
            setTimeout(() => {
                this.failLevel();
            }, 1000);
        }
    }
    
    completeLevel(endType = "normal") {
        const progress = JSON.parse(localStorage.getItem('stonelion_progress') || '{"completed": []}');
        const currentChapter = parseInt(new URLSearchParams(window.location.search).get('chapter') || '0');
        
        if (!progress.completed.includes(currentChapter)) {
            progress.completed.push(currentChapter);
            localStorage.setItem('stonelion_progress', JSON.stringify(progress));
        }
        
        let endingText = this.chapterData.completeText;
        if (endType === "ending2") {
            endingText += "\n\n🏆 獲得成就:完美結局!";
        }
        
        document.getElementById('completeText').textContent = endingText;
        document.getElementById('completeOverlay').style.display = 'flex';
        
        const nextBtn = document.getElementById('nextChapterBtn');
        if (this.chapterData.nextChapter !== null) {
            nextBtn.style.display = 'block';
            nextBtn.onclick = () => {
                window.location.href = `game.html?chapter=${this.chapterData.nextChapter}`;
            };
        } else {
            nextBtn.style.display = 'none';
        }
    }
    
    failLevel() {
        document.getElementById('completeText').textContent = "遊戲失敗!\n\n請重新嘗試";
        document.getElementById('completeOverlay').style.display = 'flex';
        document.getElementById('nextChapterBtn').style.display = 'none';
    }
    
    showHint(text) {
        document.getElementById('hintText').textContent = text;
    }
    
    // ===== 繪製功能 =====
    render() {
        this.ctx.fillStyle = '#0a0a15';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawConnections();
        this.drawNodes();
        
        requestAnimationFrame(() => this.render());
    }
    
    drawConnections() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 2;
        
        this.activeNodes.forEach(key => {
            const node = this.nodes.get(key);
            if (!node.expanded) return;
            
            node.connections.forEach(childKey => {
                if (this.activeNodes.has(childKey)) {
                    const child = this.nodes.get(childKey);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(child.x, child.y);
                    this.ctx.stroke();
                }
            });
        });
    }
    
    drawNodes() {
        this.activeNodes.forEach(key => {
            const node = this.nodes.get(key);
            this.drawNode(node);
        });
    }
    
    drawNode(node) {
        const isHovered = this.hoveredNode === node.key;
        
        this.ctx.fillStyle = this.getNodeColor(node.type, isHovered);
        this.ctx.fillRect(
            node.x - node.width / 2,
            node.y - node.height / 2,
            node.width,
            node.height
        );
        
        if (node.isGoal) {
            this.ctx.strokeStyle = '#ffd700';
            this.ctx.lineWidth = 3;
        } else if (node.isBadEnd) {
            this.ctx.strokeStyle = '#ff0000';
            this.ctx.lineWidth = 3;
        } else if (isHovered) {
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
        } else {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 1;
        }
        
        this.ctx.strokeRect(
            node.x - node.width / 2,
            node.y - node.height / 2,
            node.width,
            node.height
        );
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '18px "Microsoft JhengHei"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(node.text, node.x, node.y);
    }
    
    getNodeColor(type, highlighted) {
        const colors = {
            root: highlighted ? '#667eea' : '#4a5688',
            location: highlighted ? '#f093fb' : '#b565c9',
            character: highlighted ? '#4facfe' : '#357ab7',
            item: highlighted ? '#43e97b' : '#2ca05a',
            goal: highlighted ? '#ffd700' : '#ccaa00'
        };
        return colors[type] || (highlighted ? '#888' : '#555');
    }
    
    // ===== 事件處理 =====
    bindEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.handleStart(e.offsetX, e.offsetY));
        this.canvas.addEventListener('mousemove', (e) => this.handleMove(e.offsetX, e.offsetY));
        this.canvas.addEventListener('mouseup', (e) => this.handleEnd(e.offsetX, e.offsetY));
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.handleStart(touch.clientX - rect.left, touch.clientY - rect.top);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.handleMove(touch.clientX - rect.left, touch.clientY - rect.top);
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (e.changedTouches.length > 0) {
                const touch = e.changedTouches[0];
                const rect = this.canvas.getBoundingClientRect();
                this.handleEnd(touch.clientX - rect.left, touch.clientY - rect.top);
            }
        });
    }
    
    handleStart(x, y) {
        const clickedNode = this.getNodeAt(x, y);
        if (clickedNode) {
            this.handleNodeClick(clickedNode);
        }
    }
    
    handleMove(x, y) {
        const hovered = this.getNodeAt(x, y);
        if (hovered !== this.hoveredNode) {
            this.hoveredNode = hovered;
            if (hovered) {
                const node = this.nodes.get(hovered);
                this.showHint(node.hint);
            }
        }
    }
    
    handleEnd(x, y) {
        // 不需要特別處理
    }
    
    getNodeAt(x, y) {
        for (let key of this.activeNodes) {
            const node = this.nodes.get(key);
            if (x >= node.x - node.width / 2 &&
                x <= node.x + node.width / 2 &&
                y >= node.y - node.height / 2 &&
                y <= node.y + node.height / 2) {
                return key;
            }
        }
        return null;
    }
}

// 使用新引擎替換舊的
window.GameEngine = GameEngineV2;
