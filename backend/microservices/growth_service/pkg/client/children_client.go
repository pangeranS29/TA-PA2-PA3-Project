// pkg/client/children_client.go
package client

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type ChildrenClient struct {
	baseURL string
	client  *http.Client
}

func NewChildrenClient(baseURL string) *ChildrenClient {
	return &ChildrenClient{
		baseURL: baseURL,
		client:  &http.Client{},
	}
}

type AnakResponse struct {
	ID           int    `json:"id"`
	Nama         string `json:"nama"`
	JenisKelamin string `json:"jenis_kelamin"`
	TanggalLahir string `json:"tanggal_lahir"`
}

func (c *ChildrenClient) GetAnakByID(anakID int) (*AnakResponse, error) {
	resp, err := c.client.Get(fmt.Sprintf("%s/api/v1/anak/%d", c.baseURL, anakID))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result struct {
		Data AnakResponse `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result.Data, nil
}
