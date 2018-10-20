package io.gitlab.cs1331.gtopportunists;

public class Deal {

    private String description;
    private String event;
    private String location;
    private LocalTime startTime;
    private LocalTime endTime;

    public Deal(String description, String event, String location, LocalTime startTime,
                LocalTime endTime) {
        this.description = description;
        this.event = event;
        this.location = location;
        this.startTime = startTime;
        this.endTime = endTime;
    }


}