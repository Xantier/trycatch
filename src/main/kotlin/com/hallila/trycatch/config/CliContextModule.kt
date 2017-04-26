package com.hallila.trycatch.config

import com.google.inject.AbstractModule
import com.hallila.trycatch.boundary.HttpClient
import com.hallila.trycatch.boundary.Repository
import com.hallila.trycatch.boundary.RepositoryImpl
import com.hallila.trycatch.service.*


class CliContextModule : AbstractModule() {

    public override fun configure() {
        bind(Repository::class.java).to(RepositoryImpl::class.java)
        bind(DatabaseService::class.java).to(DatabaseServiceImpl::class.java)
        bind(HttpClientService::class.java).to(HttpClientServiceImpl::class.java)
        bind(HttpClient::class.java)
        bind(ScenarioRunner::class.java)
    }
}