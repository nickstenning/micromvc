Element.implement({
    toJson: function () {
        var json = [];
        this.getElements('input, select, textarea').each(function(el){
            if (!el.name || el.disabled) return;
            var value = (el.tagName.toLowerCase() == 'select') ? Element.getSelected(el).map(function(opt){
                return opt.value;
            }) : ((el.type == 'radio' || el.type == 'checkbox') && !el.checked) ? null : el.value;
            $splat(value).each(function(val){
                if (val) json.push('"' + el.name + '":"' + val + '"');
            });
        });
        return "{" + json.join(',') + "}";
    }
});

Array.implement({
    at: function (idx) {
        var latter = (idx + 1) || this.length;
        if (latter > this.length) {
            return this[0];
        } else {
            return this.slice(idx, latter)[0];
        }
    },
    removeAt: function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    }
});

Fx.Scroll.implement({
    toOffsetFromElement: function(el, x, y){
        var position = $(el).getPosition(this.element);
        return this.start(position.x + x, position.y + y);
    }
});