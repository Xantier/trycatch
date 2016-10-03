package com.hallila.trycatch.service

import rx.Observable

fun report(results: Observable<Result>, reporter: (String) -> Unit = ::println) {
    results.map { result ->
        val wasSuccessful = if (result.result.isRight()) "successful" else "failure"
        val expectationResponse = if (result.result.isRight()) {
            "Expected to get '${result.result.right().get().toString()}' and got that!"
        } else
            "Expected to get '${result.result.left().get().expected}' but instead got '${result.result.left().get().actual}' :((("
        "Step result for step ${result.identifier} was $wasSuccessful. $expectationResponse"
    }.reduce { s1, s2 ->
        "$s1\n$s2"
    }.subscribe({
        reporter(it)
    }, {
        reporter("Failed to process this step because of this: ${it.message}")
    })
}

fun jsonReport(results: Observable<Result>, reporter: (List<Any>) -> Unit) {
    results.toList()
        .subscribe({
            reporter(it)
        }, {
            reporter(listOf(mapOf("Error" to "Failed to process this step because of this: ${it.message}")))
        })
}
