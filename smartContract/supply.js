"use strict";

var SupplyItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.key = obj.key;
        this.value = obj.value;
        this.date = obj.date;
        this.link = obj.link;
        this.author = obj.author;
        this.remark = obj.remark;
    } else {
        this.key = "";
        this.author = "";
        this.value = "";
        this.date = "";
        this.link = "";
        this.remark = "";
    }
};

SupplyItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var Supply = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new SupplyItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

Supply.prototype = {
    init: function () {
    },

    save: function (key, value, link, date, remark) {
        var from = Blockchain.transaction.from;
        var supplyItem = this.repo.get(key);
        if (supplyItem) {
            //throw new Error("value has been occupied");
            supplyItem.value = JSON.parse(supplyItem).value + '|-' + value;
            supplyItem.author = JSON.parse(supplyItem).author + '|-' + from;
            supplyItem.link = JSON.parse(supplyItem).link + '|-' + link;
            supplyItem.date = JSON.parse(supplyItem).date + '|-' + date;
            supplyItem.remark = JSON.parse(supplyItem).remark + '|-' + remark;
            this.repo.put(key, supplyItem);

        } else {
            supplyItem = new SupplyItem();
            supplyItem.author = from;
            supplyItem.key = key;
            supplyItem.value = value;
            supplyItem.link = link;
            supplyItem.date = date;
            supplyItem.remark = remark;
            this.repo.put(key, supplyItem);
        }
    },

    get: function (key) {
        key = key.trim();
        if (key === "") {
            throw new Error("empty key")
        }
        return this.repo.get(key);
    }
};
module.exports = Supply;