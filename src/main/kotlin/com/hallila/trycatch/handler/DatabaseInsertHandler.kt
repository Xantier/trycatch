package com.hallila.trycatch.handler

import com.hallila.trycatch.repository.TestRepository
import ratpack.handling.Context
import ratpack.handling.Handler
import javax.inject.Inject
import javax.inject.Singleton


@Singleton class DatabaseInsertHandler @Inject constructor(val repository: TestRepository) : Handler {
    override fun handle(ctx: Context) {
        ctx.response.send("Hello from handler")
    }
}