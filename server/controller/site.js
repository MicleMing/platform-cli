/**
 * @file site controller
 * @author lanmingming
 * @date 2016-3-14
 */


module.exports = {

    index: function *() {
        yield this.render('pages/home/index');
    },

    proxy: function *() {
        yield this.render('pages/proxy/proxy');
    },
    
    registermock: function *() {
        var attribute = this.request.body;
        var api = attribute['api'];
        var params = (attribute['params'] || []).filter(function (item) {
            return item.param !== '';
        });

        var body = (attribute['body'] || []).filter(function (item) {
            return item.param !== '';
        });

        // store
        try {
            var response = attribute['response'].replace(/'/g, '"');
            JSON.parse(response);
        } catch (e) {
            this.response.status = 400;
            this.response.body = {
                code: 400,
                tip: 'response JSON 格式不正确或者未填写response',
                error: e.toString()
            }
            return;
        }
        this.models.lists.setApi(api);
        this.models.lists.setParams(params);
        this.models.lists.setBody(body);
        this.models.lists.setResponse(attribute['response']);
        // this.models.lists.setCount(parseInt(attribute['count']) || 5);
        this.models.lists.setMethod(attribute['method']);
        this.models.lists.save();

        // console.log('records', this.models.lists.getRecords());
        this.response.body = 'success';

    }
}