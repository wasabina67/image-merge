class ImageMerger {
    constructor() {
        this.images = [null, null, null, null];
        this.canvas = document.getElementById('mergedCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.statusMsg = document.getElementById('statusMsg');

        this.init();
    }

    init() {
        this.setupDropZones();
        this.setupButtons();
        this.showStatus('4つの正方形画像をドロップしてください。', 'info');
    }

    setupDropZones() {
        const dropZones = document.querySelectorAll('.drop-zone');

        dropZones.forEach((zone, index) => {
            zone.addEventListener('dragenter', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            zone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                if (!zone.contains(e.relatedTarget)) {
                    zone.classList.remove('drag-over');
                }
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');

                const files = Array.from(e.dataTransfer.files);
                if (files.length > 0) {
                    this.handleImageDrop(files[0], index);
                }
            });

            zone.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                    if (e.target.files.length > 0) {
                        this.handleImageDrop(e.target.files[0], index);
                    }
                };
                input.click();
            });
        });
    }

    setupButtons() {
        this.downloadBtn.addEventListener('click', () => {
            this.downloadMergedImage();
        });

        this.resetBtn.addEventListener('click', () => {
            this.resetAll();
        });
    }

    handleImageDrop(file, position) {
        if (!file.type.startsWith('image/')) {
            this.showStatus('画像ファイルを選択してください。', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                if (this.validateSquareImage(img)) {
                    this.setImage(img, position);
                } else {
                    this.showStatus('正方形の画像を選択してください。', 'error');
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    validateSquareImage(img) {
        return img.width === img.height;
    }

    setImage(img, position) {
        this.images[position] = img;

        const dropZone = document.querySelector(`[data-position="${position}"]`);
        const previewImg = dropZone.querySelector('.preview-image');
        const content = dropZone.querySelector('.drop-zone-content');

        previewImg.src = img.src;
        previewImg.style.display = 'block';
        content.style.display = 'none';
        dropZone.classList.add('has-image');

        this.updateStatus();
        this.mergeImages();
    }

    updateStatus() {
        const loadedCount = this.images.filter(img => img !== null).length;

        if (loadedCount === 4) {
            this.showStatus('すべての画像が読み込まれました。', 'success');
            this.downloadBtn.disabled = false;
        } else {
            this.showStatus(`${loadedCount}/4 画像が読み込まれました。`, 'info');
        }
    }

    mergeImages() {
        const loadedImages = this.images.filter(img => img !== null);

        if (loadedImages.length === 0) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const cellSize = this.canvas.width / 2;

        this.images.forEach((img, index) => {
            if (img) {
                const row = Math.floor(index / 2);
                const col = index % 2;
                const x = col * cellSize;
                const y = row * cellSize;

                this.ctx.drawImage(img, x, y, cellSize, cellSize);
            } else {
                const row = Math.floor(index / 2);
                const col = index % 2;
                const x = col * cellSize;
                const y = row * cellSize;

                this.ctx.fillStyle = '#f8f9fa';
                this.ctx.fillRect(x, y, cellSize, cellSize);
                this.ctx.strokeStyle = '#ddd';
                this.ctx.strokeRect(x, y, cellSize, cellSize);
            }
        });
    }

    downloadMergedImage() {
        if (this.images.every(img => img !== null)) {
            const link = document.createElement('a');
            link.download = `merged-image-${new Date().getTime()}.png`;
            link.href = this.canvas.toDataURL('image/png');
            link.click();

            this.showStatus('画像をダウンロードしました！', 'success');
        } else {
            this.showStatus('すべての画像を配置してからダウンロードしてください。', 'error');
        }
    }

    resetAll() {
        this.images = [null, null, null, null];

        document.querySelectorAll('.drop-zone').forEach((zone, index) => {
            const previewImg = zone.querySelector('.preview-image');
            const content = zone.querySelector('.drop-zone-content');

            previewImg.style.display = 'none';
            content.style.display = 'flex';
            zone.classList.remove('has-image');
        });

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.downloadBtn.disabled = true;

        this.showStatus('リセットしました。新しい画像をドロップしてください。', 'info');
    }

    showStatus(message, type = 'info') {
        this.statusMsg.textContent = message;
        this.statusMsg.className = `status ${type}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ImageMerger();
});
