package com.hallila.trycatch.config

import com.google.inject.AbstractModule
import com.hallila.trycatch.boundary.Repository
import com.hallila.trycatch.boundary.RepositoryImpl
import com.hallila.trycatch.boundary.RetrofitService
import com.hallila.trycatch.service.*


class CliContextModule : AbstractModule() {

    public override fun configure() {
        val retrofitService = RetrofitContext.build().create(RetrofitService::class.java)

        bind(Repository::class.java).to(RepositoryImpl::class.java)
        bind(DatabaseService::class.java).to(DatabaseServiceImpl::class.java)
        bind(HttpClientService::class.java).to(HttpClientServiceImpl::class.java)
        bind(RetrofitService::class.java).toInstance(retrofitService)
        bind(ScenarioRunner::class.java)
    }
}