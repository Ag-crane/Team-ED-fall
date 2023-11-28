package com.hapjusil.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AvailableRoom3Dto {
    private String practiceRoomId;
    private String practiceRoomName; // 합주실 이름
    private String address;
    private String imageUrl;

    private String visitorReviewScore; // 추가된 필드

    private String commonAddress; // 구 동 주소
    private List<RoomInfo> roomInfoList; // 연습실 아이디, 이름, 가격

    @Override
    public String toString() {
        return "AvailableRoom2Dto{" +
                "practiceRoomId='" + practiceRoomId + '\'' +
                ", practiceRoomName='" + practiceRoomName + '\'' +
                ", address='" + address + '\'' +
                ", visitorReviewScore='" + visitorReviewScore + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", roomInfoList=" + roomInfoList +
                '}';
    }
}
