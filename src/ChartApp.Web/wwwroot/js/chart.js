class Chart {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }
    randomColor(seed) {
        if (seed < 1) {
            seed = 1;
        }
        const hue = seed * 137.508; // using golden angle approximation
        return `hsl(${hue}, 100%, 75%)`;
    }
}
class PieChart extends Chart {
    constructor(canvasElement, data) {
        super(canvasElement);
        this._data = data;
    }
    draw() {
        let totalValue = 0;
        for (var categ in this._data) {
            const val = this._data[categ];
            totalValue += val;
        }
        let startAngle = 0;
        let colorIndex = 1;
        for (categ in this._data) {
            const val = this._data[categ];
            const sliceAngle = 2 * Math.PI * val / totalValue;
            const endAngle = startAngle + sliceAngle;
            const color = this.randomColor(colorIndex);
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const radius = Math.min(centerX, centerY);
            this.drawPieSlice(centerX, centerY, radius, startAngle, endAngle, color);
            this.drawPieLabel(val, totalValue, startAngle, sliceAngle);
            startAngle += sliceAngle;
            colorIndex++;
        }
    }
    drawPieLabel(value, totalValue, startAngle, sliceAngle) {
        const pieRadius = Math.min(this.canvas.width / 2, this.canvas.height / 2);
        const labelX = this.canvas.width / 2 + (pieRadius / 2) * Math.cos(startAngle + sliceAngle / 2);
        const labelY = this.canvas.height / 2 + (pieRadius / 2) * Math.sin(startAngle + sliceAngle / 2);
        const labelText = Math.round(100 * value / totalValue);
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 20px Arial";
        this.ctx.fillText(labelText + "%", labelX, labelY);
    }
    drawPieSlice(centerX, centerY, radius, startAngle, endAngle, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        this.ctx.closePath();
        this.ctx.fill();
    }
}
//# sourceMappingURL=chart.js.map