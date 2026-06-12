Feature: As a player I can create a game session

  Background:
    Given I use seed data

  Scenario: I create a new session and become its first player
    When I send a "POST" request to "/sessions"
    Then the response status should be 201
    And the response body should contain:
      """
      {
        "sessionId": "@ulid",
        "playerId": "@ulid"
      }
      """
