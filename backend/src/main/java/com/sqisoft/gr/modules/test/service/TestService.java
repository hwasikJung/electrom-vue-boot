package com.sqisoft.gr.modules.test.service;

import java.util.List;

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
}
