Feature: As a player I can see my selected characters

  Background:
    Given I use seed data

  Scenario: I see my characters with their stats
    Given I identify as player "01HRESEED0000000000000P101"
    When I send a "GET" request to "/api/v1/my-characters"
    Then the response status should be 200
    And the response body should contain:
      """
      [
        { "type": "IRIS", "stats": { "health": 6, "power": 4, "defense": 4, "intelligence": 9 } },
        { "type": "SKYE", "stats": { "health": 7, "power": 7, "defense": 4, "intelligence": 4 } },
        { "type": "SUNNY", "stats": { "health": 6, "power": 8, "defense": 4, "intelligence": 3 } },
        { "type": "THORA", "stats": { "health": 6, "power": 8, "defense": 3, "intelligence": 5 } },
        { "type": "VEGA", "stats": { "health": 8, "power": 6, "defense": 3, "intelligence": 8 } }
      ]
      """

  Scenario: I cannot see characters for a player that does not exist
    Given I identify as player "01ARZ3NDEKTSV4RRFFQ69G5FAV"
    When I send a "GET" request to "/api/v1/my-characters"
    Then the response status should be 401
    And the response body should contain:
      """
      {
        "message": "Unauthorized",
        "statusCode": 401
      }
      """

  Scenario: I cannot see characters without identifying myself
    When I send a "GET" request to "/api/v1/my-characters"
    Then the response status should be 401
    And the response body should contain:
      """
      {
        "message": "Unauthorized",
        "statusCode": 401
      }
      """

  Scenario: I cannot see characters with a malformed player id
    Given I identify as player "not-a-ulid"
    When I send a "GET" request to "/api/v1/my-characters"
    Then the response status should be 401
    And the response body should contain:
      """
      {
        "message": "Unauthorized",
        "statusCode": 401
      }
      """
