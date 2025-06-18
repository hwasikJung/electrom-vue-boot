package com.sqisoft.gr.modules.test.service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.sqisoft.gr.modules.test.dto.TestDto;
import com.sqisoft.gr.modules.test.mapper.TestMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TestService {

	private final TestMapper testMapper;

	public List<TestDto> findAll() {
		return testMapper.findAll();
	}

	public void insertSalesData(TestDto testDto) {
		testMapper.insertSalesData(testDto);
	}

	public void bulkDeleteSalesData(List<Long> ids) {
		// 입력값 검증
		if (ids == null || ids.isEmpty()) {
			throw new IllegalArgumentException("ID 목록이 비어있습니다");
		}

		// null이나 유효하지 않은 ID 필터링 및 검증
		List<Long> validIds = ids.stream()
			.filter(Objects::nonNull)
			.filter(id -> id > 0)
			.collect(Collectors.toList());

		if (validIds.isEmpty()) {
			throw new IllegalArgumentException("유효한 ID가 없습니다");
		}

		if (validIds.size() != ids.size()) {
			throw new IllegalArgumentException("유효하지 않은 ID가 포함되어 있습니다");
		}

		// 한 번의 쿼리로 일괄 삭제
		testMapper.bulkDeleteSalesData(validIds);
	}

	public void updateSalesData(TestDto testDto) {

		if (testDto == null || testDto.getId() == null) {
			throw new IllegalArgumentException("유효하지 않은 데이터입니다");
		}

		// 데이터 삽입 또는 업데이트
		testMapper.updateSalesData(testDto); // Assuming this method is used for both insert and update
	}
}
