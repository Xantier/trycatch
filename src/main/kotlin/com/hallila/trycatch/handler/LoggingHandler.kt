package com.hallila.trycatch.handler


import com.hallila.trycatch.WithLogging
import ratpack.handling.Context
import ratpack.handling.Handler

/**
 * An example of a handler implicitly set up by a module
 *
 * @see MyModule
 */
class LoggingHandler : WithLogging(), Handler {
    override fun handle(context: Context) {
        LOG.info("Received: ${context.request.uri}")
        context.next()
    }
}
