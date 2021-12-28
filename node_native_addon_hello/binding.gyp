{
    "targets": [
        {
            "target_name": "fun",
            "sources": [
                "fun.cxx"
            ],
            "include_dirs": [
                "<!(node -e \"require('nan')\")"
            ]
        }
    ]
}
