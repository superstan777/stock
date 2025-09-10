import { getDevices, addDevice, updateDevice } from "./devices";
import { DeviceInsert } from "../types/devices";

describe("devicesApi", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getDevices", () => {
    it("calls fetch with correct URL and query params", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await getDevices("computer", "model", "Lenovo", 2, 10);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/devices/computer")
      );
      const calledUrl = (fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain("page=2");
      expect(calledUrl).toContain("perPage=10");
      expect(calledUrl).toContain("filter=model");
      expect(calledUrl).toContain("query=Lenovo");
    });

    it("throws error when fetch fails", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

      await expect(getDevices("monitor")).rejects.toThrow(
        "Failed to fetch devices"
      );
    });
  });

  describe("addDevice", () => {
    const mockDevice: DeviceInsert = {
      serial_number: "123",
      model: "ABC",
      order_id: "order-1",
      install_status: "Deployed",
    };

    it("calls fetch with POST method and body", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockDevice],
      });

      await addDevice("computer", mockDevice);

      expect(fetch).toHaveBeenCalledWith("/api/devices/computer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockDevice),
      });
    });

    it("throws error when fetch fails", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

      await expect(addDevice("monitor", mockDevice)).rejects.toThrow(
        "Failed to add device"
      );
    });
  });

  describe("updateDevice", () => {
    const updates = { model: "XYZ" };

    it("calls fetch with PATCH method and correct URL", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [updates],
      });

      await updateDevice("computer", "1", updates);

      expect(fetch).toHaveBeenCalledWith("/api/devices/computer?id=1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    });

    it("throws error when fetch fails", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

      await expect(updateDevice("monitor", "2", updates)).rejects.toThrow(
        "Failed to update device"
      );
    });
  });
});
