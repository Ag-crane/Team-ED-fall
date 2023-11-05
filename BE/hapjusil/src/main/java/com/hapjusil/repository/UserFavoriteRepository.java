package com.hapjusil.repository;

import com.hapjusil.domain.PracticeRoom;
import com.hapjusil.domain.User;
import com.hapjusil.domain.UserFavorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Long> {
    List<UserFavorite> findByUserId(Long userId);
    Optional<UserFavorite> findByUserAndPracticeRoom(User user, PracticeRoom practiceRoom);

}
