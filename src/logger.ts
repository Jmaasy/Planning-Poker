abstract class Logger {
    static WARN(body: string | Object) {
        console.log(`\x1b[33m[WARN]\x1b[0m ${body}`);
    }

    static ERROR(body: string | Object) {
        console.log(`\x1b[1m\x1b[31m[ERROR]\x1b[0m ${body}`);
    }

    static INFO(body: string | Object) {
        console.log(`\x1b[1m\x1b[2m[INFO]\x1b[0m ${body}`);
    }

    static DEBUG(body: string | Object) {
        console.log(`\x1b[1m\x1b[35m[DEBUG]\x1b[0m ${body}`);
    }

    static LOG(title: string, body: string | Object) {
        console.log(`\x1b[1m\x1b[36m[${title}]\x1b[0m ${body}`);
    }
}

export default Logger; 