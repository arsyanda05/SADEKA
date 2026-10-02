const API_URL = "http://localhost:5000/api";

export const getPenduduk = async () => {
  const response = await fetch(`${API_URL}/penduduk`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data penduduk");
  }

  return response.json();
};

export const createPenduduk = async (data) => {
  const response = await fetch(`${API_URL}/penduduk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Gagal menambahkan data penduduk");
  }

  return response.json();
};

export const updatePenduduk = async (id, data) => {
  const response = await fetch(`${API_URL}/penduduk/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Gagal mengubah data penduduk");
  }

  return response.json();
};

export const deletePenduduk = async (id) => {
  const response = await fetch(`${API_URL}/penduduk/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Gagal menghapus data penduduk");
  }

  return response.json();
};

export const getPegawai = async () => {
  const response = await fetch(`${API_URL}/pegawai`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal mengambil data pegawai"
    );
  }

  return result;
};

export const getDetailPegawai = async (id) => {
  const response = await fetch(
    `${API_URL}/pegawai/${id}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal mengambil detail pegawai"
    );
  }

  return result;
};

export const createPegawai = async (data) => {
  const response = await fetch(`${API_URL}/pegawai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal menambahkan data pegawai"
    );
  }

  return result;
};

export const updatePegawai = async (id, data) => {
  const response = await fetch(
    `${API_URL}/pegawai/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal mengubah data pegawai"
    );
  }

  return result;
};

export const deletePegawai = async (id) => {
  const response = await fetch(
    `${API_URL}/pegawai/${id}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal menghapus data pegawai"
    );
  }

  return result;
};

export const getDokumenPegawai = async () => {
  const response = await fetch(
    `${API_URL}/dokumen-pegawai`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal mengambil dokumen pegawai"
    );
  }

  return result;
};

export const getDokumenPegawaiByPegawai = async (
  id_pegawai
) => {
  const response = await fetch(
    `${API_URL}/dokumen-pegawai/pegawai/${id_pegawai}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal mengambil dokumen pegawai"
    );
  }

  return result;
};

export const createDokumenPegawai = async (
  formData
) => {
  const response = await fetch(
    `${API_URL}/dokumen-pegawai`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal mengupload dokumen pegawai"
    );
  }

  return result;
};

export const deleteDokumenPegawai = async (
  id
) => {
  const response = await fetch(
    `${API_URL}/dokumen-pegawai/${id}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal menghapus dokumen pegawai"
    );
  }

  return result;
};

export const getDiklat = async () => {
  const response = await fetch(
    `${API_URL}/diklat`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal mengambil riwayat diklat"
    );
  }

  return result;
};

export const getDiklatByPegawai = async (
  id_pegawai
) => {
  const response = await fetch(
    `${API_URL}/diklat/pegawai/${id_pegawai}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal mengambil riwayat diklat"
    );
  }

  return result;
};

export const createDiklat = async (
  formData
) => {
  const response = await fetch(
    `${API_URL}/diklat`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal menyimpan riwayat diklat"
    );
  }

  return result;
};

export const deleteDiklat = async (id) => {
  const response = await fetch(
    `${API_URL}/diklat/${id}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal menghapus riwayat diklat"
    );
  }

  return result;
};

export const getSurat = async () => {
  const response = await fetch(
    `${API_URL}/surat`
  );

  if (!response.ok) {
    throw new Error(
      "Gagal mengambil data surat"
    );
  }

  return response.json();
};

export const getSuratAhliWaris = async () => {
  const response = await fetch(
    `${API_URL}/surat-ahli-waris`
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal mengambil surat ahli waris"
    );
  }

  return result;
};

export const getSuratById = async (id) => {
  const response = await fetch(
    `${API_URL}/surat/${id}`
  );

  if (!response.ok) {
    throw new Error(
      "Gagal mengambil detail surat"
    );
  }

  return response.json();
};

export const createSurat = async (data) => {
  const response = await fetch(
    `${API_URL}/surat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Gagal menambahkan surat"
    );
  }

  return response.json();
};

export const createSuratWithDocument = async (data, documentFile) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, String(value ?? ""));
  });
  formData.append("dokumen", documentFile);

  const response = await fetch(`${API_URL}/surat`, {
    method: "POST",
    body: formData,
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal menambahkan surat");
  }

  return result;
};

export const updateSurat = async (
  id,
  data
) => {
  const response = await fetch(
    `${API_URL}/surat/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Gagal mengubah surat"
    );
  }

  return response.json();
};

export const deleteSurat = async (id) => {
  const response = await fetch(
    `${API_URL}/surat/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Gagal menghapus surat"
    );
  }

  return response.json();
};

export const registerUser = async (
  data
) => {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal melakukan pendaftaran"
    );
  }

  return result;
};

export const loginUser = async (
  data
) => {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal melakukan login"
    );
  }

  return result;
};

export const resetPassword = async (
  data
) => {
  const response = await fetch(
    `${API_URL}/auth/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal mengubah password"
    );
  }

  return result;
};

export const getAgenda = async () => {
  const response = await fetch(
    `${API_URL}/agenda`
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal mengambil data agenda"
    );
  }

  return result;
};

export const createAgenda = async (
  data
) => {
  const response = await fetch(
    `${API_URL}/agenda`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal menambahkan agenda"
    );
  }

  return result;
};

export const updateAgenda = async (
  id,
  data
) => {
  const response = await fetch(
    `${API_URL}/agenda/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal mengubah agenda"
    );
  }

  return result;
};

export const deleteAgenda = async (
  id
) => {
  const response = await fetch(
    `${API_URL}/agenda/${id}`,
    {
      method: "DELETE",
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal menghapus agenda"
    );
  }

  return result;
};

export const updateAgendaReminderSnooze =
  async (id) => {
    const response = await fetch(
      `${API_URL}/agenda/${id}/tunda`,
      {
        method: "PUT",
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Gagal menunda pengingat agenda"
      );
    }

    return result;
  };

export const confirmAgendaReminder =
  async (id) => {
    const response = await fetch(
      `${API_URL}/agenda/${id}/konfirmasi`,
      {
        method: "PUT",
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Gagal mengonfirmasi agenda"
      );
    }

    return result;
  };

export const getKesejahteraan =
  async () => {
    const response = await fetch(
      `${API_URL}/kesejahteraan`
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Gagal mengambil data kesejahteraan"
      );
    }

    return result;
  };

export const getDetailKesejahteraan =
  async (id) => {
    const response = await fetch(
      `${API_URL}/kesejahteraan/${id}`
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Gagal mengambil detail kesejahteraan"
      );
    }

    return result;
  };

export const createKesejahteraan =
  async (data) => {
    const response = await fetch(
      `${API_URL}/kesejahteraan`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Gagal menambahkan data kesejahteraan"
      );
    }

    return result;
  };

export const updateKesejahteraan =
  async (id, data) => {
    const response = await fetch(
      `${API_URL}/kesejahteraan/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Gagal mengubah data kesejahteraan"
      );
    }

    return result;
  };

export const deleteKesejahteraan =
  async (id) => {
    const response = await fetch(
      `${API_URL}/kesejahteraan/${id}`,
      {
        method: "DELETE",
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Gagal menghapus data kesejahteraan"
      );
    }

    return result;
  };

export const getUMKM = async () => {
  const response = await fetch(
    `${API_URL}/umkm`
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal mengambil data UMKM"
    );
  }

  return result;
};

export const getDetailUMKM =
  async (id) => {
    const response = await fetch(
      `${API_URL}/umkm/${id}`
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Gagal mengambil detail UMKM"
      );
    }

    return result;
  };

export const createUMKM =
  async (data) => {
    const response = await fetch(
      `${API_URL}/umkm`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Gagal menambahkan data UMKM"
      );
    }

    return result;
  };

export const updateUMKM =
  async (id, data) => {
    const response = await fetch(
      `${API_URL}/umkm/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Gagal mengubah data UMKM"
      );
    }

    return result;
  };

export const deleteUMKM =
  async (id) => {
    const response = await fetch(
      `${API_URL}/umkm/${id}`,
      {
        method: "DELETE",
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Gagal menghapus data UMKM"
      );
    }

    return result;
  };

export const getInfrastruktur =
  async () => {
    const response = await fetch(
      `${API_URL}/infrastruktur`
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Gagal mengambil data infrastruktur"
      );
    }

    return result;
  };

export const getDetailInfrastruktur =
  async (id) => {
    const response = await fetch(
      `${API_URL}/infrastruktur/${id}`
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Gagal mengambil detail infrastruktur"
      );
    }

    return result;
  };

export const createInfrastruktur =
  async (data) => {
    const response = await fetch(
      `${API_URL}/infrastruktur`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Gagal menambahkan data infrastruktur"
      );
    }

    return result;
  };

export const updateInfrastruktur =
  async (id, data) => {
    const response = await fetch(
      `${API_URL}/infrastruktur/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Gagal mengubah data infrastruktur"
      );
    }

    return result;
  };

export const deleteInfrastruktur =
  async (id) => {
    const response = await fetch(
      `${API_URL}/infrastruktur/${id}`,
      {
        method: "DELETE",
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Gagal menghapus data infrastruktur"
      );
    }

    return result;
  };

export const askAsistenData = async (question) => {
  const response = await fetch(
    `${API_URL}/asisten-data`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Gagal menghubungi Asisten Data"
    );
  }

  return result;
};