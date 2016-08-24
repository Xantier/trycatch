package com.hallila.trycatch.handler

import com.hallila.trycatch.repository.TestRepository
import ratpack.handling.Context
import ratpack.handling.Handler
import ratpack.jackson.Jackson
import javax.inject.Inject
import javax.inject.Singleton


@Singleton class DatabaseInsertHandler @Inject constructor(val repository: TestRepository) : Handler {
    override fun handle(ctx: Context) {
        repository.insert(ctx.parse(Jackson.jsonNode()).map {
            it.get("json").get("query").asText()
        })
        ctx.response.send("Hello from handler")
    }
}