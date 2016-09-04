package com.hallila.trycatch.config

import com.fasterxml.jackson.dataformat.yaml.snakeyaml.Yaml
import com.google.inject.AbstractModule
import com.google.inject.Provides
import com.google.inject.Singleton
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import ratpack.hikari.HikariService
import java.nio.file.Files
import java.nio.file.Paths
import java.util.*
import javax.sql.DataSource

class HikariModule : AbstractModule() {

    override fun configure() {
    }

    @Provides
    @Singleton
    fun hikariConfig(): HikariConfig {
        val yaml = Yaml()
        val hikariConfig = Files.newInputStream(Paths.get("conf/db.yml")).use({ `in` ->
            val config = yaml.loadAs(`in`, Map::class.java)
            val props = Properties()
            val map = config.get("db") as Map<*, *>
            map.forEach { prop ->
                if (prop.key == "dataSourceProperties") {
                    val from = prop.value as Map<*, *>
                    from.forEach { f ->
                        props.setProperty("dataSource.${f.key}", f.value.toString())
                    }
                } else {
                    props.setProperty(prop.key.toString(), prop.value.toString())
                }
            }
            HikariConfig(props)
        })
        return hikariConfig
    }

    @Provides
    @Singleton
    fun hikariService(config: HikariConfig): HikariService {
        return HikariService(HikariDataSource(config))
    }

    @Provides
    @Singleton
    fun dataSource(service: HikariService): DataSource {
        return getDataSource(service)
    }

    private fun getDataSource(service: HikariService): DataSource {
        return service.dataSource
    }
}

