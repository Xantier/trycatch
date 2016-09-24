package com.hallila.trycatch.web

import com.hallila.trycatch.config.WebContextModule
import com.hallila.trycatch.handler.*
import com.hallila.trycatch.serverOf
import com.zaxxer.hikari.HikariConfig
import org.slf4j.LoggerFactory
import ratpack.handling.Context
import ratpack.hikari.HikariModule
import ratpack.server.BaseDir

object MainRat {

    private val log = LoggerFactory.getLogger(MainRat::class.java)

    @JvmStatic fun main(args: Array<String>) {
        try {
            createServer(args).start()
        } catch (e: Exception) {
            log.error("", e)
            System.exit(1)
        }
    }

    fun createServer(args: Array<String>) = serverOf {
        serverConfig { builder ->
            builder
                .baseDir(BaseDir.find())
                .yaml("db.yml")
                .env()
                .sysProps()
                .args(args)
                .require("/db", HikariConfig::class.java)
        }
        guiceRegistry {
            module(WebContextModule())
            module(HikariModule())
        }

        handlers {
            prefix("static") {
                prefix("dist") {
                    fileSystem("static/dist") { files() }
                }
                prefix("img") {
                    fileSystem("static/img") { files() }
                }
                prefix("style") {
                    fileSystem("static/style") { files() }
                }
                prefix("lib") {
                    fileSystem("static/lib") { files() }
                }
            }

            prefix("view") {
                fileSystem("static/view") { files({ it.indexFiles("index.html") }) }
            }

            prefix("api") {
                prefix("scenario"){
                    post("save", ScenarioSaveHandler::class.java)
                    post("run", ScenarioRunHandler::class.java)
                }

                post("json", HttpRequestHandler::class.java)
                post("insert", DatabaseInsertHandler::class.java)
                post("select", DatabaseSelectHandler::class.java)
            }
        }
    }
}

/** A handler as a method */
fun bazHandler(context: Context) = context.render("from the baz handler")

