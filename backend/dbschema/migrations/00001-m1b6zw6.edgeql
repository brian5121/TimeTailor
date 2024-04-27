CREATE MIGRATION m1b6zw6447livsfl3pbm2e6snf2c325o3wthnharjz4umam5tp7d2a
    ONTO initial
{
  CREATE TYPE default::Event {
      CREATE REQUIRED PROPERTY endTime: std::datetime;
      CREATE REQUIRED PROPERTY deadline: std::datetime {
          SET default := (.endTime);
      };
      CREATE PROPERTY description: std::str {
          SET default := '';
      };
      CREATE REQUIRED PROPERTY startTime: std::datetime;
      CREATE PROPERTY duration := (<std::int64>(std::duration_to_seconds((.endTime - .startTime)) / 60));
      CREATE REQUIRED PROPERTY fixed: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY location: std::str {
          SET default := 'N/A';
      };
      CREATE REQUIRED PROPERTY priority: std::int16 {
          SET default := 5;
          CREATE CONSTRAINT std::max_value(10);
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY title: std::str;
  };
  CREATE TYPE default::User {
      CREATE MULTI LINK events: default::Event;
      CREATE REQUIRED PROPERTY email: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY name: std::str;
  };
  ALTER TYPE default::Event {
      CREATE REQUIRED LINK owner: default::User;
  };
  CREATE TYPE default::Recurrence {
      CREATE LINK event: default::Event;
      CREATE REQUIRED PROPERTY pattern: std::str;
      CREATE PROPERTY until: std::datetime;
  };
  CREATE TYPE default::UserInput {
      CREATE LINK relatedEvent: default::Event;
      CREATE LINK user: default::User;
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY timestamp: std::datetime;
  };
};
