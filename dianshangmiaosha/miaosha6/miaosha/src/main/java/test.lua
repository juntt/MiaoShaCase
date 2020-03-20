local args = ngx.req.get_uri_args()
local id = args["id"]
--引入文件
local redis = require "resty.redis"
local cache = redis:new()
local ok,err = cache:connect("106.14.105.113",6379)
local item_model = cache:get("item"..id)
if item_model == ngx.null or item_model == nil then
    local resp = ngx.location.capture("/item/get?id="..id)
    item_model = resp.body
end

ngx.say(item_model)

