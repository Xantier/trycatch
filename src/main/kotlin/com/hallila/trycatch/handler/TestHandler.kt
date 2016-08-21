package com.hallila.trycatch.handler

import com.hallila.trycatch.repository.TestRepository
import ratpack.handling.Context
import ratpack.handling.Handler
import javax.inject.Inject
import javax.inject.Singleton

@Singleton class TestHandler @Inject constructor(val testRepository: TestRepository) : Handler {
    override fun handle(ctx: Context) {
        ctx.response.send("service value: ${testRepository.retrieveCases()}")
    }
}