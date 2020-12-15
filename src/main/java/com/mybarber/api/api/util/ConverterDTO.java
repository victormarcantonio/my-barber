package com.mybarber.api.api.util;


import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ConverterDTO {

    private static ModelMapper mModelMapper;
    @Autowired
    private ModelMapper modelMapper;

    @PostConstruct
    public void init() {
        this.mModelMapper = modelMapper;
    }

    public static Object toDoMain(Object dto, Class doMain) {

        return mModelMapper.map(dto, doMain);
    }

    public static Object toDTO(Object doMain, Class dto) {

        return mModelMapper.map(doMain, dto);
    }

    /*public static List<Object> toListDTO(List<Object> listDoMain, Class dto) {

        return listDoMain.stream()
                .map(doMain -> dto.cast(toDTO(doMain, dto)) )
                .collect(Collectors.toList());
    }*/


    /*public static List<Object> toListDTO(List<Object> listDoMain, Class dto) {

        var list = new ArrayList<>();

        listDoMain.forEach(doMain -> {
            var Objdto = toDTO(doMain, dto);
            list.add(dto);
        });

        return list;

    }*/


    public static List<Object> toListDoMain(List<Object> dtoList, Class doMain) {

        return dtoList.stream()
                .map(dto -> toDTO(dto, doMain))
                .collect(Collectors.toList());
    }
}


