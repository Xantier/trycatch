package com.hallila.trycatch.service

import rx.Observable

fun report(results: Observable<Result>, reporter: (String) -> Unit = ::println) {
    results.map { result ->
        val wasSuccessful = if (result.result.isRight()) "successful" else "failure"
        val expectationResponse = if (result.result.isRight()) {
            "Expected to get '${result.result.right().get().toString()}' and got that!"
        } else
            "Expected to get '${result.result.left().get().expected}' but instead got '${result.result.left().get().actual}' :((("
        reporter("Step result for step ${result.identifier} was $wasSuccessful. $expectationResponse")
    }.subscribe({}, {
        println(it)
        reporter("Failed to process this step because of this: ${it.message}")
    })
}
