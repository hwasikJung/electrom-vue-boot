package com.sqisoft.gr.modules.test.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.sqisoft.gr.modules.test.dto.TestDto;

@Mapper
public interface TestMapper {
	List<TestDto> findAll();

	void insertSalesData(TestDto testDto);

	void bulkDeleteSalesData(List<Long> validIds);

	void updateSalesData(TestDto testDto);

}
