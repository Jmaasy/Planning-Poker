abstract class Logger {
    static #getLevelPrefix(level: string) {
        const infoPrefix = "[2m[INFO]"
        const warnPrefix = "[33m[WARN]"
        const errorPrefix = "[31m[ERROR]"
        const debugPrefix = "[35m[DEBUG]"

        if (level == "ERROR") {
            return errorPrefix;
        } else if (level == "DEBUG") {
            return debugPrefix;
        } else if (level == "WARN") {
            return warnPrefix;
        } else {
            return infoPrefix;
        }
    }

    static WARN(body: string | Object) {
        const prefix = this.#getLevelPrefix("WARN")
        console.log(`\x1b[1m\x1b${prefix}\x1b[0m ${body}`);
    }

    static ERROR(body: string | Object) {
        const prefix = this.#getLevelPrefix("ERROR")
        console.log(`\x1b[1m\x1b${prefix}\x1b[0m ${body}`);
    }

    static INFO(body: string | Object) {
        const prefix = this.#getLevelPrefix("INFO")
        console.log(`\x1b[1m\x1b${prefix}\x1b[0m ${body}`);
    }

    static DEBUG(body: string | Object) {
        const prefix = this.#getLevelPrefix("DEBUG")
        console.log(`\x1b[1m\x1b${prefix}\x1b[0m ${body}`);
    }

    static LOG(title: string, body: string | Object, level: string = "INFO") {
        const prefix = this.#getLevelPrefix(level)
        console.log(`\x1b[1m\x1b${prefix}\x1b[36m[${title}]\x1b[0m ${body}`);
    }
}

export default Logger; 