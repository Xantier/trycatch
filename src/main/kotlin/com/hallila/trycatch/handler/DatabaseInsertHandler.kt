package com.hallila.trycatch.handler

import com.hallila.trycatch.service.DatabaseService
import ratpack.handling.Context
import ratpack.handling.Handler
import ratpack.jackson.Jackson
import ratpack.rx.RxRatpack
import javax.inject.Inject
import javax.inject.Singleton


@Singleton class DatabaseInsertHandler @Inject constructor(val service: DatabaseService) : Handler {
    override fun handle(ctx: Context) {
        ctx.parse(Jackson.jsonNode())
            .map { it.get("json").get("query").asText() }
            .then {
                RxRatpack.promise(service.insert(it))
                    .then { ctx.response.send(it.toString()) }
            }
    }
}