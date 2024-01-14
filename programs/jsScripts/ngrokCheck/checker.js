const {getCurrentDevice} = require("../dbUtil/deviceUtil");
const axios = require("axios");
const {loggerCommand} = require("../util/loggerUtil");
const {delay} = require("../commandsListener/commandUtil");
const deviceUtil = require("../dbUtil/deviceUtil");

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

(async () => {
    let init = false;

    //let processed = false;
    while (true) {
        try {
            const res = await axios.get('http://127.0.0.1:4040/api/tunnels', {
            })
            const data = res.data;
            let publicUrl = data.tunnels[0].public_url;
            const rdpAddress = publicUrl.split("//") [1];
            console.log(rdpAddress);
            const device = await getCurrentDevice();
            device.rdpAddress = rdpAddress;
            await deviceUtil.updateDevice(device)
            await sleep(20000);
        } catch (error) {
            device.rdpAddress = null;
            const device = await getCurrentDevice();
            await deviceUtil.updateDevice(device)
            await delay(2000);
        }
    }
    process.exit();

})();
