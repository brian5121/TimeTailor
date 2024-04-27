module default {
    # Define the User type
    type User {
        required property name -> str;
        required property email -> str {
            constraint exclusive;  # Ensures email addresses are unique
        }
        multi link events -> Event;  # Links users to their events
    }

    # Define the Event type
    type Event {
        required property title -> str;
        property description -> str {
            default := "";
        }
        required property startTime -> datetime;
        required property endTime -> datetime {
            constraint expression on (SELECT .endTime > .startTime);
        }
        # Dynamically calculate duration in minutes
        property duration -> int64 {
            # Calculate the duration as the difference between endTime and startTime in minutes
            expression := <int64>((.endTime - .startTime) / <duration>'1 minute');
        }
        required property deadline -> datetime {
            # Set the deadline as the endTime by default, ensured to be a valid datetime expression
            default := .endTime;
        }
        required property location -> str {
            default := "N/A";
        }
        required link owner -> User;  # Establishes ownership of an event by a user

        required property fixed -> bool {
            default := false;
        }
        required property priority -> int16 {
            default := 5;  # priority from 1 to 10; higher value = more priority
            constraint range (1, 10);
        }
    }

    # Define the UserInput type
    type UserInput {
        required property content -> str;  # The actual input from the user
        required property timestamp -> datetime;
        link user -> User;  # Connects the input to a specific user
        link relatedEvent -> Event;  # Optional link to an event, if applicable
    }

    # Define the Recurrence type
    type Recurrence {
        required property pattern -> str;  # e.g., "weekly", "monthly"
        property until -> datetime;  # Optional end date for the recurrence
        link event -> Event;  # Connects recurrence information to an event
    }
}
