let CloudwatchProcess = require('../obj/src/container/CloudwatchProcess').CloudwatchProcess;

try {
    new CloudwatchProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
