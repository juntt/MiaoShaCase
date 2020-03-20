var page = require("webpage").create();
var fs = require("fs");
page.open("http://miaoshaserver/resources/getitem.html?id=6",function (status) {

    console.log("status = " + status);
    var isInit = "0";
    setInterval(function () {
        if (isInit!="1") {
            page.evaluate(function () {
                initView();
            });
            isInit = page.evaluate(function () {
                return hasInit();
            });
        } else {
            fs.write("getitem.html",page.content,"w");
            phantom.exit();
        }

    },1000);
});
