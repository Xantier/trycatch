package com.hallila.trycatch.cli

import org.slf4j.LoggerFactory


object MainCli {

    private val log = LoggerFactory.getLogger(MainCli::class.java)

    @JvmStatic fun main(args: Array<String>) {
        try {
            println("Hello World")
        } catch (e: Exception) {
            log.error("", e)
            System.exit(1)
        }
    }

}