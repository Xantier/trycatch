package com.hallila.trycatch.web

import com.hallila.trycatch.config.MainModule
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
            module(MainModule())
            module(HikariModule())
        }

        handlers {
            path("foo") { render("from the foo handler") }
            path("bar") { render("from the bar handler") }

            // Map to /baz using a Kotlin function
            path("baz", ::bazHandler)

            // Set up a nested routing block, which is delegated to `nestedHandler`
            prefix("nested") {
                path(":var1/:var2?") {
                    // The path tokens are the :var1 and :var2 path components above
                    val var1 = pathTokens["var1"]
                    val var2 = pathTokens["var2"]
                    render("from the nested handler, var1: $var1, var2: $var2")
                }
            }

            // Map to a dependency injected handler
            path("injected", MyHandler::class.java)
            prefix("test") {
                path("test", TestHandler::class.java)
                path("get", HttpRequestHandler::class.java)
            }

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
            }

            prefix("view") {
                fileSystem("static/view") { files({ it.indexFiles("index.html") }) }
            }

            prefix("api") {
                post("json", HttpRequestHandler::class.java)
                post("insert", DatabaseInsertHandler::class.java)
                post("select", DatabaseSelectHandler::class.java)
            }
        }
    }
}

/** A handler as a method */
fun bazHandler(context: Context) = context.render("from the baz handler")

