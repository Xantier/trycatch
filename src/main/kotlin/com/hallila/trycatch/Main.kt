package com.hallila.trycatch

import com.hallila.trycatch.cli.MainCli
import com.hallila.trycatch.web.MainRat
import org.slf4j.LoggerFactory.getLogger

object Main {
    private val log = getLogger(Main::class.java)

    @JvmStatic fun main(args: Array<String>) {
        if (args.isNotEmpty()) {
            log.info("Starting try-catch with arguments: {}", args)
        }
        if (args.isNotEmpty() && args[0] == "cli") {
            log.info("Running Application in CLI mode")
            MainCli.main(args)
        } else {
            log.info("Running Application in web mode")
            MainRat.main(args)
        }
    }
}