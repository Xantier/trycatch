package com.hallila.trycatch.handler


import com.hallila.trycatch.WithLogging
import ratpack.handling.Context
import ratpack.handling.Handler

class LoggingHandler : WithLogging(), Handler {
    override fun handle(context: Context) {
        LOG.info("Received: ${context.request.uri}")
        context.next()
    }
}
