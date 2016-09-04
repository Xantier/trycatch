package com.hallila.trycatch.service

import com.google.inject.Inject
import com.google.inject.Singleton
import com.hallila.trycatch.model.Scenario

@Singleton class ScenarioRunner @Inject constructor(
    val databaseService: DatabaseService,
    val httpClientService: HttpClientService
) {
    fun handleScenario(scenario: Scenario): String {
        println(scenario)
        databaseService.select("SELECT * FROM cities").subscribe { println(it) }
        httpClientService.get("http://jsonplaceholder.typicode.com/posts/1").subscribe { println(it) }
        return ""
    }
}

