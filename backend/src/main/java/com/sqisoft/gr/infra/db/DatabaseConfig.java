package com.sqisoft.gr.infra.db;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

@Configuration
@MapperScan(
	basePackages = "com.sqisoft.gr.modules.*.mapper",
	annotationClass = org.apache.ibatis.annotations.Mapper.class
)
public class DatabaseConfig {

	private static final String CONFIG_LOCATION = "classpath:mybatis/config/mybatis-config.xml";
	private static final String MAPPER_LOCATION_PATTERN = "classpath:mybatis/mapper/**/*.xml";

	@Bean
	public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
		SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
		sessionFactory.setDataSource(dataSource);

		PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
		sessionFactory.setMapperLocations(resolver.getResources(MAPPER_LOCATION_PATTERN));
		sessionFactory.setConfigLocation(resolver.getResource(CONFIG_LOCATION));

		return sessionFactory.getObject();
	}

	@Bean
	public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
		return new SqlSessionTemplate(sqlSessionFactory);
	}
}

