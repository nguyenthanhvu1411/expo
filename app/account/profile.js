import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../contexts/AuthContext";
import UserService from "../../services/UserService";
import { router } from "expo-router";
import { storageUrl } from "../../config/api";
import Alert from "../../utils/Alert";

export default function ProfileScreen() {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [avatarUri, setAvatarUri] = useState(null);
  const [isAvatarChanged, setIsAvatarChanged] = useState(false);

  // input chọn ảnh trên web
  const fileInputRef = useRef(null);

  // state + ref cho webcam web
  const [showWebCamera, setShowWebCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });

      if (user.avatar) {
        setAvatarUri(storageUrl(user.avatar));
      }
      setIsAvatarChanged(false);
    }
  }, [user]);

  // Khi showWebCamera thay đổi: start/stop stream cho web
  useEffect(() => {
    if (Platform.OS !== "web") return;

    const startCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        Alert.alert(
          "Lỗi",
          "Trình duyệt không hỗ trợ truy cập camera. Vui lòng dùng Chrome/Edge bản mới."
        );
        setShowWebCamera(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play?.();
        }
      } catch (err) {
        console.error("getUserMedia error:", err);
        Alert.alert("Lỗi", "Không truy cập được camera");
        setShowWebCamera(false);
      }
    };

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };

    if (showWebCamera) {
      startCamera();
    } else {
      stopCamera();
    }

    // cleanup khi unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [showWebCamera]);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: null });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Họ tên phải có ít nhất 2 ký tự";
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    const phoneRegex = /^0\d{9}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải có đúng 10 số và bắt đầu bằng 0";
    }

    if (
      formData.address &&
      formData.address.trim().length > 0 &&
      formData.address.trim().length < 10
    ) {
      newErrors.address = "Địa chỉ phải có ít nhất 10 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =============== CHỌN ẢNH THƯ VIỆN ===============
  const pickImage = async () => {
    // Web: mở dialog chọn file
    if (Platform.OS === "web") {
      fileInputRef.current?.click();
      return;
    }

    // Mobile: dùng ImagePicker
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Cần quyền truy cập",
        "Cần cấp quyền truy cập thư viện ảnh để chọn ảnh đại diện"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
      setIsAvatarChanged(true);
    }
  };

  // =============== CHỤP ẢNH ===============
  const takePhoto = async () => {
    // Web: mở overlay webcam
    if (Platform.OS === "web") {
      setShowWebCamera(true);
      return;
    }

    // Mobile: dùng camera của expo-image-picker
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Cần quyền camera",
        "Vui lòng cấp quyền camera để chụp ảnh"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
      setIsAvatarChanged(true);
    }
  };

  // handler đọc file (web) – dùng chung cho cả chọn từ thư viện
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      Alert.alert("Lỗi", "Vui lòng chọn file ảnh (JPEG, JPG, PNG, GIF)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      Alert.alert("Lỗi", "Kích thước ảnh không được vượt quá 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUri(reader.result); // dataURL
      setIsAvatarChanged(true);
    };
    reader.readAsDataURL(file);

    // reset để lần sau chọn cùng file vẫn trigger
    event.target.value = "";
  };

  // chụp frame từ webcam trên web
  const handleCaptureFromWebcam = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setAvatarUri(dataUrl);
    setIsAvatarChanged(true);
    setShowWebCamera(false);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        avatar: avatarUri,
        isAvatarChanged: isAvatarChanged,
      };

      const updatedUser = await UserService.updateProfile(user.id, payload);
      await updateUser(updatedUser);
      setIsAvatarChanged(false);
      Alert.alert("Thành công", "Thông tin cá nhân đã được cập nhật!");
    } catch (error) {
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;

        const newErrors = {};
        if (apiErrors.email) newErrors.email = apiErrors.email[0];
        if (apiErrors.phone) newErrors.phone = apiErrors.phone[0];
        if (apiErrors.name) newErrors.name = apiErrors.name[0];
        if (apiErrors.address) newErrors.address = apiErrors.address[0];

        setErrors(newErrors);
      } else {
        Alert.alert("Lỗi", "Cập nhật thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* Overlay webcam cho web */}
      {Platform.OS === "web" && showWebCamera && (
        <View style={styles.cameraOverlay}>
          <View style={styles.cameraBox}>
            <Text style={styles.cameraTitle}>Chụp ảnh bằng camera</Text>
            <video
              ref={videoRef}
              style={styles.cameraVideo}
              autoPlay
              playsInline
              muted
            />
            <View style={styles.cameraButtons}>
              <TouchableOpacity
                style={[styles.cameraBtn, styles.cameraBtnPrimary]}
                onPress={handleCaptureFromWebcam}
              >
                <Text style={styles.cameraBtnText}>Chụp</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cameraBtn, styles.cameraBtnSecondary]}
                onPress={() => setShowWebCamera(false)}
              >
                <Text style={styles.cameraBtnText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/account")}
        disabled={loading}
      >
        <FontAwesome5 name="arrow-left" size={20} color="#111" />
      </TouchableOpacity>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Thông tin cá nhân</Text>

        {/* Avatar Section */}
        <View style={styles.avatarBox}>
          <TouchableOpacity
            onPress={pickImage}
            disabled={loading}
            style={styles.avatarCircle}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <FontAwesome5 name="user" size={32} color="#fff" />
            )}
            {isAvatarChanged && (
              <View style={styles.changedBadge}>
                <FontAwesome5 name="check" size={12} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {/* Hàng nút chọn ảnh / chụp ảnh */}
          <View style={styles.avatarActions}>
            <TouchableOpacity onPress={pickImage} disabled={loading}>
              <Text style={styles.changeAvatar}>Chọn từ thư viện</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto} disabled={loading}>
              <Text style={styles.changeAvatar}>Chụp ảnh</Text>
            </TouchableOpacity>
          </View>

          {/* input chọn file cho web */}
          {Platform.OS === "web" && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          )}
        </View>

        {/* Họ tên */}
        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Nguyễn Văn A"
          placeholderTextColor="#777"
          value={formData.name}
          onChangeText={(text) => handleChange("name", text)}
          editable={!loading}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="email@example.com"
          placeholderTextColor="#777"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          editable={!loading}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Phone */}
        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          placeholder="0123 456 789"
          placeholderTextColor="#777"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => handleChange("phone", text)}
          maxLength={10}
          editable={!loading}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

        {/* Address */}
        <Text style={styles.label}>
          Địa chỉ <Text style={styles.optional}>(Tùy chọn)</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            errors.address && styles.inputError,
          ]}
          placeholder="Số nhà, đường, phường, quận, thành phố..."
          placeholderTextColor="#777"
          multiline
          numberOfLines={4}
          value={formData.address}
          onChangeText={(text) => handleChange("address", text)}
          editable={!loading}
        />
        {errors.address && (
          <Text style={styles.errorText}>{errors.address}</Text>
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Lưu thay đổi</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 110,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  avatarBox: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
    position: "relative",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  changedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarActions: {
    flexDirection: "row",
    gap: 16,
  },
  changeAvatar: {
    color: "#007bff",
    fontSize: 13,
    fontWeight: "500",
  },
  label: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
    marginTop: 10,
  },
  optional: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#f8f8f8",
    fontSize: 14,
  },
  inputError: {
    borderColor: "#ff3b30",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  errorText: {
    fontSize: 12,
    color: "#ff3b30",
    marginTop: 4,
    marginLeft: 4,
  },
  saveBtn: {
    marginTop: 22,
    backgroundColor: "#000",
    borderRadius: 14,
    paddingVertical: 12,
  },
  saveBtnDisabled: {
    backgroundColor: "#666",
  },
  saveText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },

  // === styles cho webcam overlay (web) ===
  cameraOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
  },
  cameraBox: {
    width: "90%",
    maxWidth: 500,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  cameraTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  cameraVideo: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#000",
  },
  cameraButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 12,
  },
  cameraBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  cameraBtnPrimary: {
    backgroundColor: "#000",
  },
  cameraBtnSecondary: {
    backgroundColor: "#777",
  },
  cameraBtnText: {
    color: "#fff",
    fontWeight: "500",
  },
});
