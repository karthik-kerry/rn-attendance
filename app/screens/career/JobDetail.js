import { View, Text, ScrollView } from "react-native";
import React from "react";

const JobDetail = ({ route }) => {
  const { job } = route.params; // Access the job data passed from JobListing

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 10 }}>
        {job.job_name}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 5 }}>
        Company: {job.cmp_name}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 5 }}>
        Department: {job.department_name}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 5 }}>
        Status: {job.is_active ? "Active" : "Inactive"}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 5 }}>
        Experience: {job.experience_form}{" "}
        {job.experience_to ? `– ${job.experience_to} Years` : "+ Years"}
      </Text>
      {/* Add more fields as needed */}
    </ScrollView>
  );
};

export default JobDetail;
