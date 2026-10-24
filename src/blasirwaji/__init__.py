"""BlaSirWaJi - Moroccan document routing assistant."""


def main() -> None:
    import uvicorn
    uvicorn.run("blasirwaji.main:app", host="0.0.0.0", port=8000, reload=True)
