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
class LineChart extends Chart {
    constructor(canvasElement, data) {
        super(canvasElement);
        this._data = data;
        this._maxX = 0;
        this._minX = 0;
        this._maxY = 0;
        this._minY = 0;
    }
    draw() {
        this.drawX();
        this.drawY();
        //this._data.forEach(i => {
        //    this.drawCategory(i);
        //});
    }
    drawCategory(data) {
        const xValues = this.getValuesX(data.points);
        const yValues = this.getValuesY(data.points);
        const maxX = this.getMax(xValues);
        const minX = this.getMin(xValues);
        const maxY = this.getMax(yValues);
        const minY = this.getMin(yValues);
        if (maxX > this._maxX) {
            this._maxX = maxX;
        }
        if (minX < this._minX) {
            this._minX = minX;
        }
        if (maxY > this._maxY) {
            this._maxY = maxY;
        }
        if (minY < this._minY) {
            this._minY = minY;
        }
    }
    drawX() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        this.drawLine(0, height, width, height, 2);
    }
    drawY() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        this.drawLine(0, height, 0, 0, 2);
    }
    drawLine(startX, startY, endX, endY, lineWidth = 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();
    }
    getMax(values) {
        let max = values[0];
        values.forEach(i => {
            if (i > max) {
                max = i;
            }
        });
        return max;
    }
    getMin(values) {
        let min = values[0];
        values.forEach(i => {
            if (i < min) {
                min = i;
            }
        });
        return min;
    }
    getValuesX(values) {
        const xValues = new Array();
        values.forEach(i => {
            xValues.push(i.x);
        });
        return xValues;
    }
    getValuesY(values) {
        const yValues = new Array();
        values.forEach(i => {
            yValues.push(i.y);
        });
        return yValues;
    }
}
//# sourceMappingURL=chart.js.map