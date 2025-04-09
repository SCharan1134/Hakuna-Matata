import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type TimePickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (
    openTime: Date | null,
    closeTime: Date | null,
    type: "Everyday" | "Weekends" | "Regular"
  ) => void;
};

const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [openTime, setOpenTime] = useState<Date | null>(null);
  const [closeTime, setCloseTime] = useState<Date | null>(null);
  const [type, setType] = useState<"Everyday" | "Weekends" | "Regular">(
    "Everyday"
  );

  const [showOpenPicker, setShowOpenPicker] = useState(false);
  const [showClosePicker, setShowClosePicker] = useState(false);

  const handleTimeChange = (
    event: any,
    selectedTime: Date | undefined,
    isOpenTime: boolean
  ) => {
    if (selectedTime) {
      isOpenTime ? setOpenTime(selectedTime) : setCloseTime(selectedTime);
    }
    setShowOpenPicker(false);
    setShowClosePicker(false);
  };

  const isFormComplete = type && openTime !== null && closeTime !== null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      className="relative flex-1 justify-center items-center"
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="w-11/12 bg-white p-5 rounded-xl">
          <Text className="text-lg font-bold mb-4 text-center">
            Select Open and Closed Timings
          </Text>

          {/* Type Selection */}
          <View className="flex-row justify-around mb-4">
            {["Everyday", "Weekends", "Regular"].map((item) => (
              <TouchableOpacity
                key={item}
                className={`px-4 py-2 border border-gray-400 rounded-full ${
                  type === item ? "bg-black" : "bg-white"
                }`}
                onPress={() =>
                  setType(item as "Everyday" | "Weekends" | "Regular")
                }
              >
                <Text
                  className={`text-sm ${
                    type === item ? "text-white" : "text-black"
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Time Pickers */}
          <View className="flex-row justify-between mb-4">
            <TouchableOpacity
              className="flex-1 py-3 border border-gray-400 rounded-md mx-2 items-center"
              onPress={() => setShowOpenPicker(true)}
            >
              <Text className="text-black">
                {openTime ? openTime.toLocaleTimeString() : "Open Time"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 py-3 border border-gray-400 rounded-md mx-2 items-center"
              onPress={() => setShowClosePicker(true)}
            >
              <Text className="text-black">
                {closeTime ? closeTime.toLocaleTimeString() : "Close Time"}
              </Text>
            </TouchableOpacity>
          </View>

          {showOpenPicker && (
            <DateTimePicker
              value={openTime || new Date()}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedTime) =>
                handleTimeChange(event, selectedTime, true)
              }
            />
          )}

          {showClosePicker && (
            <DateTimePicker
              value={closeTime || new Date()}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedTime) =>
                handleTimeChange(event, selectedTime, false)
              }
            />
          )}

          {/* Buttons */}
          <View className="flex-row justify-end absolute top-0 right-0">
            <TouchableOpacity
              className="absolute top-0 right-0 p-2"
              onPress={onClose}
            >
              <Text className="text-xl text-black">X</Text>
            </TouchableOpacity>
          </View>

          {/* Add Button - Disabled if Form is Incomplete */}
          <TouchableOpacity
            className={`w-full py-3 rounded-md text-center ${
              isFormComplete ? "bg-black" : "bg-gray-400"
            }`}
            onPress={() => {
              if (isFormComplete) {
                onSave(openTime, closeTime, type);
                onClose();
              }
            }}
            disabled={!isFormComplete}
          >
            <Text className="text-white text-center text-lg">Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TimePickerModal;
